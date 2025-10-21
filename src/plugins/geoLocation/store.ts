/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/geoLocation/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Overlay from 'ol/Overlay'

import VectorLayer from 'ol/layer/Vector'
import Point from 'ol/geom/Point'
import { Vector } from 'ol/source'
import Feature from 'ol/Feature'
import { containsCoordinate } from 'ol/extent'
import * as Proj from 'ol/proj.js'
import Geolocation from 'ol/Geolocation.js'
import { transform as transformCoordinates } from 'ol/proj'
import { noop } from 'es-toolkit'
import {
	PluginId,
	type PluginState,
	type GeoLocationPluginOptions,
} from './types'

import { getGeoLocationStyle } from './olStyle'
import { notifyUser } from '@/lib/notifyUser.js'
import { getTooltip } from '@/lib/tooltip'
import { useCoreStore } from '@/core/stores/export'
import { passesBoundaryCheck } from '@/lib/passesBoundaryCheck'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for geoLocation.
 */
/* eslint-enable tsdoc/syntax */
export const useGeoLocationStore = defineStore('plugins/geoLocation', () => {
	const coreStore = useCoreStore()

	const markerFeature = new Feature({
		type: 'point',
		name: 'geoLocationMarker',
	})

	const geoLocationMarkerLayer = new VectorLayer({
		source: new Vector({ features: [markerFeature] }),
		properties: { name: 'geoLocationMarkerLayer' },
		zIndex: Infinity,
		style: getGeoLocationStyle(),
	})

	const positionChanged = (
		oldPosition: number[],
		newPosition: number[]
	): boolean =>
		oldPosition[0] !== newPosition[0] || oldPosition[1] !== newPosition[1]

	const rootConfiguration = computed(() => coreStore.configuration)
	const configuration = computed(
		() => rootConfiguration.value[PluginId] as GeoLocationPluginOptions
	)
	const showTooltip = computed(() => Boolean(configuration.value.showTooltip))

	const geolocation = ref<Geolocation | null>(null)
	const position = ref<number[]>([])
	const isGeolocationDenied = ref(false)
	const lastBoundaryCheck = ref<boolean | symbol | null>(null)

	const detectDeniedGeolocationEarly = () =>
		void navigator.permissions
			.query({ name: 'geolocation' })
			.then((result) => {
				if (result.state === 'denied') {
					isGeolocationDenied.value = true
				}
			})
			.catch(() => {
				/* Can't help it, we'll figure this one out later. */
			})

	const setupPlugin = () => {
		// TODO: remove timeout when execution order is fixed
		setTimeout(() => {
			coreStore.map.addLayer(geoLocationMarkerLayer)
			if (configuration.value.checkLocationInitially) {
				track()
			} else {
				detectDeniedGeolocationEarly()
			}
			setupTooltip()
		}, 2000)
	}

	function teardownPlugin() {
		coreStore.map.removeLayer(geoLocationMarkerLayer)
		untrack()
		teardownTooltip()
	}

	let teardownTooltip = noop
	function setupTooltip() {
		if (showTooltip.value) {
			const { unregister, element } = getTooltip({
				localeKeys: [['h2', 'markerText', { ns: 'geoLocation' }]],
			})
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

	function heading(e) {
		markerFeature.set('heading', e.target.getHeading())
	}

	async function positioning() {
		const coordinatesInMapCrs = transformCoordinates(
			geolocation.value?.getPosition() as number[],
			Proj.get('EPSG:4326') as Proj.Projection,
			rootConfiguration.value.epsg
		)

		const isCoordinateInExtent = containsCoordinate(
			// NOTE: The fallback is the default value set by @masterportal/masterportalApi
			rootConfiguration.value.extent ?? [
				510000.0, 5850000.0, 625000.4, 6000000.0,
			],
			coordinatesInMapCrs
		)

		const boundaryCheckPassed = await passesBoundaryCheck(
			coreStore.map,
			configuration.value.boundary.layerId,
			coordinatesInMapCrs
		)

		const boundaryCheckChanged = lastBoundaryCheck.value !== boundaryCheckPassed
		lastBoundaryCheck.value = boundaryCheckPassed

		const showBoundaryLayerError =
			typeof boundaryCheckPassed === 'symbol' &&
			configuration.value.boundary.onError === 'strict'

		if (!isCoordinateInExtent || showBoundaryLayerError) {
			printPositioningFailed(showBoundaryLayerError)
			untrack()
			return
		}

		if (positionChanged(position.value, coordinatesInMapCrs)) {
			position.value = coordinatesInMapCrs
			addMarker(coordinatesInMapCrs)

			if (boundaryCheckChanged && !boundaryCheckPassed) {
				printPositioningFailed(false)
			}
		}
	}

	function printPositioningFailed(boundaryErrorOccurred: boolean) {
		if (showTooltip.value) {
			if (boundaryErrorOccurred) {
				notifyUser('error', 'toast.boundaryError', { ns: 'geoLocation' })
			} else {
				notifyUser(
					'info',
					'toast.notInBoundary',
					{ ns: 'geoLocation' },
					{ timeout: 10000 }
				)
			}
		} else if (boundaryErrorOccurred) {
			console.error('Checking boundary layer failed.')
		} else {
			console.warn('User position outside of boundary layer.')
		}
	}

	/**
	 * Adds a marker to the map, which indicates the users geoLocation.
	 * This happens by applying a style to the geoLocationMarkerLayer and
	 * a geometry to the geoLocationMarker.
	 */
	function addMarker(coordinates) {
		const hadPosition = Boolean(markerFeature.getGeometry())
		markerFeature.setGeometry(new Point(coordinates))

		// TODO: This logic is to be changed. Keep stuck on the zoomedAndCentered position until the user manually pans. In that case, stop following.
		if (
			(configuration.value.keepCentered || !hadPosition) &&
			lastBoundaryCheck.value
		) {
			zoomAndCenter()
		}
	}

	/**
	 * Removes the geoLocation marker from the map.
	 */
	function removeMarker(): void {
		markerFeature.setGeometry(undefined)
		position.value = []
	}

	/**
	 * Zooms to the configured zoomLevel and centers the map
	 * according to a users coordinates
	 */
	function zoomAndCenter() {
		coreStore.map.getView().setCenter(position.value)
		coreStore.map.getView().setZoom(configuration.value.zoomLevel ?? 7)
	}

	/**
	 * Show error information and stop tracking if there are errors by tracking the position
	 */
	function onError(error) {
		if (showTooltip.value) {
			notifyUser('error', 'button.tooltip.locationAccessDenied', {
				ns: 'geoLocation',
			})
		} else {
			console.error(
				'@polar/plugin-geo-location: Location access denied by user.'
			)
		}
		console.error('@polar/polar/plugin/geoLocation', error.message)

		isGeolocationDenied.value = true
		removeMarker()
	}

	const state = computed<PluginState>(() => {
		if (isGeolocationDenied.value) {
			return 'DISABLED'
		} else if (geolocation.value === null) {
			return 'LOCATABLE'
		}

		return 'LOCATED'
	})

	/** Enable tracking of geo position */
	function track() {
		if (!isGeolocationDenied.value) {
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
			geolocation.value.on('change:heading', heading)
			geolocation.value.on('error', onError)
		} else {
			onError({
				message: 'Geolocation API usage was denied by user or configuration.',
			})
		}
	}

	/**
	 * Stop tracking of geo position
	 */
	function untrack() {
		geolocation.value?.setTracking(false) // for FireFox - cannot handle geolocation.un(...)
		removeMarker()
		geolocation.value = null
	}

	// TODO: change action, click shall always track or re-track, untracking is probably not a feature anymore
	const action = computed(
		() =>
			({
				LOCATABLE: track,
				LOCATED: untrack,
				DISABLED: noop,
			})[state.value]
	)

	return {
		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,

		/**
		 * The plugin's current state. It can either currently have the user's
		 * position ('LOCATED'), be ready to retrieve it ('LOCATABLE'), or be
		 * disabled ('DISABLED') due to the user or browser settings not allowing
		 * the Geolocation API access.
		 */
		state,

		/**
		 * The action that would currently unfold upon clicking the icon, depending
		 * on the state. If the state is 'DISABLED', nothing is done. In the other
		 * states, the geolocation procedure is (re-)run.
		 */
		action,

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
