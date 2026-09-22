/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pins/store
 */
/* eslint-enable tsdoc/syntax */

import type { GeoJsonGeometryTypes, Point as GeoJsonPoint } from 'geojson'
import type { MapBrowserEvent } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type Point from 'ol/geom/Point'
import type { PolarGeoJsonFeature } from '@/core'
import type { PinMovable, PinsPluginOptions } from './types'

import { toMerged } from 'es-toolkit'
import { pointerMove } from 'ol/events/condition'
import { Select, Translate } from 'ol/interaction'
import { toLonLat } from 'ol/proj'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useStoreWatcher } from '@/composables/useStoreWatcher'
import { useCoreStore } from '@/core/stores'

import { usePinLayer } from './composables/usePinLayer'
import { PluginId } from './types'
import { getPinStyle } from './utils/getPinStyle'
import { getPointCoordinate } from './utils/getPointCoordinate'
import { isCoordinateInBoundaryLayer } from './utils/isCoordinateInBoundaryLayer'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for adding a pin to the map for e.g. coordinate retrieval or
 * marking the location of a found address.
 */
/* eslint-enable tsdoc/syntax */
export const usePinsStore = defineStore('plugins/pins', () => {
	const coreStore = useCoreStore()

	const coordinate = ref<Coordinate | null>(null)
	const getsDragged = ref(false)

	const configuration = computed<
		PinsPluginOptions & {
			minZoomLevel: number
			movable: PinMovable
			toZoomLevel: number
		}
	>(() =>
		toMerged(
			{ minZoomLevel: 0, movable: 'none', toZoomLevel: 0 },
			coreStore.configuration.pins || {}
		)
	)
	const latLon = computed(() => {
		if (!coordinate.value) {
			return null
		}
		const lonLat = toLonLat(coordinate.value, coreStore.configuration.epsg)
		return [lonLat[1], lonLat[0]]
	})

	const { pinLayer } = usePinLayer(
		coordinate,
		getPinStyle(configuration.value.style || {})
	)
	const move = new Select({
		layers: (l) => l === pinLayer,
		style: null,
		condition: pointerMove,
	})
	const translate = new Translate({
		condition: () =>
			(coreStore.map.getView().getZoom() as number) >=
			configuration.value.minZoomLevel,
		layers: [pinLayer],
	})

	useStoreWatcher(
		() => configuration.value.coordinateSources || [],
		(value) => {
			const feature = value as PolarGeoJsonFeature<GeoJsonPoint> | null
			// NOTE: 'reverse_geocoded' is set as type on reverse geocoded features
			// to prevent infinite loops as in: ReverseGeocode->AddressSearch->Pins->ReverseGeocode.
			if (feature && feature.type !== 'reverse_geocoded') {
				addPin(feature.geometry.coordinates, false, {
					type: feature.geometry.type,
				})
			}
		},
		{ target: { plugin: PluginId, key: 'coordinate' } }
	)

	function setupPlugin() {
		coreStore.map.addLayer(pinLayer)
		pinLayer.setZIndex(100)
		coreStore.map.on('singleclick', onSingleClick)
		setupInitial()
		setupInteractions()
	}

	function teardownPlugin() {
		const { map } = coreStore
		map.un('singleclick', onSingleClick)
		map.removeLayer(pinLayer)
		map.removeInteraction(move)
		map.removeInteraction(translate)
		coordinate.value = null
	}

	function setupInitial() {
		const { initial } = configuration.value
		if (initial) {
			const { coordinate, centerOn, epsg } = initial

			if (centerOn) {
				addPin(coordinate, false, {
					epsg: epsg || coreStore.configuration.epsg,
					type: 'Point',
				})
				return
			}
			addPin(coordinate)
		}
	}

	function setupInteractions() {
		move.on('select', ({ selected }) => {
			if (configuration.value.movable === 'none') {
				document.body.style.cursor = selected.length ? 'not-allowed' : ''
			}
		})
		coreStore.map.addInteraction(move)

		const { movable } = configuration.value
		if (movable !== 'drag') {
			return
		}
		translate.on('translatestart', () => (getsDragged.value = true))
		translate.on('translateend', ({ features }) => {
			getsDragged.value = false

			features.forEach(async (feature) => {
				const geometryCoordinates = (
					feature.getGeometry() as Point
				).getCoordinates()

				const newCoordinate = !(await isCoordinateInBoundaryLayer(
					geometryCoordinates,
					coreStore.map,
					configuration.value.boundary
				))
					? coordinate.value
					: geometryCoordinates

				if (newCoordinate) {
					addPin(newCoordinate)
				}
			})
		})
		coreStore.map.addInteraction(translate)
	}

	async function onSingleClick({ coordinate }: MapBrowserEvent) {
		await click(coordinate)
	}

	async function click(coordinate: Coordinate) {
		const { minZoomLevel, movable } = configuration.value
		if (
			(movable === 'drag' || movable === 'click') &&
			// NOTE: It is assumed that getZoom actually returns the currentZoomLevel, thus the view has a constraint in the resolution.
			(coreStore.map.getView().getZoom() as number) >= minZoomLevel &&
			!coreStore.isInteractionMasked('click') &&
			(await isCoordinateInBoundaryLayer(
				coordinate,
				coreStore.map,
				configuration.value.boundary
			))
		) {
			addPin(coordinate)
		}
	}

	function addPin(
		newCoordinate: Coordinate,
		clicked = true,
		pinInformation?: {
			type: Exclude<GeoJsonGeometryTypes, 'GeometryCollection'>
			epsg?: string
		}
	) {
		if (!clicked && pinInformation) {
			coordinate.value = getPointCoordinate(
				pinInformation.epsg || coreStore.configuration.epsg,
				coreStore.configuration.epsg,
				pinInformation.type,
				newCoordinate
			)
			coreStore.map.getView().setCenter(coordinate.value)
			coreStore.map.getView().setZoom(configuration.value.toZoomLevel)
		} else {
			coordinate.value = newCoordinate
		}
	}

	return {
		/**
		 * Current coordinate of the pin.
		 */
		coordinate,

		/**
		 * The {@link coordinate | pinCoordinate} transcribed to latitude / longitude.
		 */
		latLon,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})
