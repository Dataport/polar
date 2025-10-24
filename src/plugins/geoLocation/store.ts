/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/geoLocation/store
 */
/* eslint-enable tsdoc/syntax */

import { noop, toMerged } from 'es-toolkit'
import { t } from 'i18next'
import type { Coordinate } from 'ol/coordinate'
import { containsCoordinate } from 'ol/extent'
import Feature from 'ol/Feature'
import Geolocation from 'ol/Geolocation'
import Point from 'ol/geom/Point'
import VectorLayer from 'ol/layer/Vector'
import Overlay from 'ol/Overlay'
import * as Proj from 'ol/proj'
import { transform as transformCoordinates } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { PluginState, GeoLocationPluginOptions } from './types'
import { detectDeniedGeolocationEarly } from './utils/detectDeniedGeolocationEarly'
import { getGeoLocationStyle } from './utils/olStyle'
import { positionChanged } from './utils/positionChanged'
import { useCoreStore } from '@/core/stores/export'
import { notifyUser } from '@/lib/notifyUser'
import { passesBoundaryCheck } from '@/lib/passesBoundaryCheck'
import { getTooltip } from '@/lib/tooltip'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for geoLocation.
 */
/* eslint-enable tsdoc/syntax */
export const useGeoLocationStore = defineStore('plugins/geoLocation', () => {
	const coreStore = useCoreStore()

	const isGeolocationDenied = ref(false)
	const geolocation = ref<Geolocation | null>(null)
	const lastBoundaryCheck = ref<boolean | symbol | null>(null)
	const position = ref<number[]>([])

	const configuration = computed<
		GeoLocationPluginOptions & { showTooltip: boolean; zoomLevel: number }
	>(() =>
		toMerged(
			{ showTooltip: false, zoomLevel: 7 },
			coreStore.configuration.geoLocation || {}
		)
	)
	const boundary = computed(() => configuration.value.boundary)
	const state = computed<PluginState>(() => {
		if (isGeolocationDenied.value) {
			return 'DISABLED'
		} else if (geolocation.value === null) {
			return 'LOCATABLE'
		}

		return 'LOCATED'
	})

	const markerFeature = new Feature({
		type: 'point',
		name: 'geoLocationMarker',
	})
	const geoLocationMarkerLayer = new VectorLayer({
		source: new VectorSource({ features: [markerFeature] }),
		properties: { name: 'geoLocationMarkerLayer' },
		zIndex: Infinity,
		style: getGeoLocationStyle(),
	})

	function setupPlugin() {
		coreStore.map.addLayer(geoLocationMarkerLayer)
		if (configuration.value.checkLocationInitially) {
			track()
		} else {
			void detectDeniedGeolocationEarly().then(
				(isDenied) => (isGeolocationDenied.value = isDenied)
			)
		}
		setupTooltip()
	}

	function teardownPlugin() {
		coreStore.map.removeLayer(geoLocationMarkerLayer)
		untrack()
		removeMarker()
		teardownTooltip()
	}

	let teardownTooltip = noop
	function setupTooltip() {
		if (configuration.value.showTooltip) {
			const { unregister, element } = getTooltip([
				['h2', 'markerText', { ns: 'geoLocation' }],
			])
			const overlay = new Overlay({
				element,
				positioning: 'bottom-center',
				offset: [0, -5],
			})
			coreStore.map.addOverlay(overlay)
			const updateTooltip = ({ pixel, dragging }) => {
				if (dragging) {
					return
				}
				const features = coreStore.map.getFeaturesAtPixel(pixel, {
					layerFilter: (layer) =>
						layer.get('name') === 'geoLocationMarkerLayer',
				})

				const coordinate = features.length
					? coreStore.map.getCoordinateFromPixel(pixel)
					: undefined
				overlay.setPosition(coordinate)
			}
			coreStore.map.on('pointermove', updateTooltip)

			teardownTooltip = () => {
				unregister()
				coreStore.map.removeOverlay(overlay)
				coreStore.map.un('pointermove', updateTooltip)
				teardownTooltip = noop
			}
		}
	}

	function locate() {
		;(state.value === 'LOCATABLE' ? track : untrack)()
	}

	/** Enable tracking of geo position */
	function track() {
		if (isGeolocationDenied.value) {
			onError({
				message: 'Geolocation API usage was denied by user or configuration.',
			})
			return
		}
		if (geolocation.value === null) {
			geolocation.value = new Geolocation({
				trackingOptions: {
					// required for heading TODO: should probably be configurable
					enableHighAccuracy: true,
				},
				tracking: true,
				projection: Proj.get('EPSG:4326') as Proj.Projection,
			})
		} else {
			void positioning()
		}
		geolocation.value.on('change:position', positioning) // TODO: Kinda jitters a lot in FF ... :<
		geolocation.value.on('change:heading', ({ target }) => {
			markerFeature.set('heading', target.getHeading())
		})
		geolocation.value.on('error', onError)
	}

	/**
	 * Show error information and stop tracking if there are errors by tracking the position
	 */
	function onError(error: { message: string }) {
		notifyUser(
			'error',
			t(($) => $.button.locationAccessDenied, {
				ns: 'geoLocation',
			})
		)
		console.error(error.message)

		isGeolocationDenied.value = true
		removeMarker()
	}

	/**
	 * Stop tracking of geo position
	 */
	function untrack() {
		// For FireFox - cannot handle geolocation.un(...).
		geolocation.value?.setTracking(false)
		removeMarker()
		geolocation.value = null
	}

	async function positioning() {
		const coordinatesInMapCrs = transformCoordinates(
			geolocation.value?.getPosition() as number[],
			Proj.get('EPSG:4326') as Proj.Projection,
			coreStore.configuration.epsg as string
		)

		const isCoordinateInExtent = coreStore.configuration.extent
			? containsCoordinate(coreStore.configuration.extent, coordinatesInMapCrs)
			: true

		const boundaryCheckPassed = await passesBoundaryCheck(
			coreStore.map,
			boundary.value?.layerId,
			coordinatesInMapCrs
		)

		const boundaryCheckChanged = lastBoundaryCheck.value !== boundaryCheckPassed

		lastBoundaryCheck.value = boundaryCheckPassed

		const showBoundaryLayerError =
			typeof boundaryCheckPassed === 'symbol' &&
			boundary.value?.onError === 'strict'

		if (!isCoordinateInExtent || showBoundaryLayerError) {
			printPositioningFailed(showBoundaryLayerError)
			untrack()
			return
		}

		if (positionChanged(position.value, coordinatesInMapCrs)) {
			addMarker(coordinatesInMapCrs)

			if (boundaryCheckChanged && !boundaryCheckPassed) {
				printPositioningFailed(false)
			}
		}
	}

	/**
	 * Adds a marker to the map, which indicates the users geoLocation.
	 * This happens by applying a style to the geoLocationMarkerLayer and
	 * a geometry to the geoLocationMarker.
	 */
	function addMarker(coordinate: Coordinate) {
		position.value = coordinate

		const hadPosition = Boolean(markerFeature.getGeometry())
		markerFeature.setGeometry(new Point(coordinate))

		// TODO: This logic is to be changed. Keep stuck on the zoomedAndCentered position until the user manually pans. In that case, stop following.
		if (
			(configuration.value.keepCentered || !hadPosition) &&
			lastBoundaryCheck.value
		) {
			coreStore.map.getView().setCenter(coordinate)
			coreStore.map.getView().setZoom(configuration.value.zoomLevel)
		}
	}

	/**
	 * Removes the geoLocation marker from the map.
	 */
	function removeMarker() {
		markerFeature.setGeometry(undefined)
		position.value = []
	}

	function printPositioningFailed(boundaryErrorOccurred: boolean) {
		if (boundaryErrorOccurred) {
			const msg = t(($) => $.toast.boundaryError, { ns: 'geoLocation' })
			notifyUser('error', msg)
			console.error(msg)
			return
		}
		const msg = t(($) => $.toast.notInBoundary, {
			ns: 'geoLocation',
		})
		notifyUser('info', msg, { timeout: 10000 })
		// eslint-disable-next-line no-console
		console.info(msg)
	}

	return {
		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,

		/**
		 * The action that would currently unfold upon clicking the icon, depending
		 * on the state.
		 *
		 * @internal
		 */
		locate,

		/**
		 * GeoLocation plugin configuration including default values.
		 *
		 * @internal
		 */
		configuration,

		/**
		 * The plugin's current state. It can either currently have the user's
		 * position ('LOCATED'), be ready to retrieve it ('LOCATABLE'), or be
		 * disabled ('DISABLED') due to the user or browser settings not allowing
		 * the Geolocation API access.
		 *
		 * @internal
		 */
		state,

		/**
		 * While in state 'LOCATED', the user's location's coordinated are available
		 * as [number, number] of the map's configured CRS.
		 */
		position,

		/**
		 * Initially null. If no boundary check is configured or the check is
		 * passed, this field holds `true`. If the boundary check is not passed,
		 * this field holds `false`.
		 *
		 * May also hold a symbol from the `@polar/polar/lib/passesBoundaryCheck.ts`
		 * errors export, if such an error occurred.
		 */
		boundaryCheck: lastBoundaryCheck,
	}
})
