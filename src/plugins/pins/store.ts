/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pins/store
 */
/* eslint-enable tsdoc/syntax */

import { toMerged } from 'es-toolkit'
import type { GeoJsonGeometryTypes } from 'geojson'
import { defineStore } from 'pinia'
import type { Coordinate } from 'ol/coordinate'
import { pointerMove } from 'ol/events/condition'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Draw, Modify, Select, Translate } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import { toLonLat } from 'ol/proj'
import { Vector } from 'ol/source'
import { computed, ref, watch, type WatchHandle } from 'vue'
import type { PinMovable, PinsPluginOptions } from './types'
import { getPinStyle } from './utils/getPinStyle'
import { getPointCoordinate } from './utils/getPointCoordinate'
import { isCoordinateInBoundaryLayer } from './utils/isCoordinateInBoundaryLayer'
import { useCoreStore } from '@/core/stores/export'

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

	const coordinate = ref<Coordinate>([])
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
	const latLon = computed(() =>
		toLonLat(coordinate.value, coreStore.configuration.epsg as string)
	)

	const pinLayer = new VectorLayer({
		source: new Vector(),
		style: getPinStyle(configuration.value.style || {}),
	})
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
	let coordinateSourceWatcher: WatchHandle | null = null

	function setupPlugin() {
		coreStore.map.addLayer(pinLayer)
		pinLayer.setZIndex(100)
		coreStore.map.on('singleclick', ({ coordinate }) => {
			click(coordinate)
		})
		setupCoordinateSource()
		setupInitial()
		setupInteractions()
	}

	function teardownPlugin() {
		const { map } = coreStore
		map.un('singleclick', ({ coordinate }) => {
			click(coordinate)
		})
		removePin()
		map.removeLayer(pinLayer)
		map.removeInteraction(move)
		map.removeInteraction(translate)
		if (coordinateSourceWatcher) {
			coordinateSourceWatcher()
		}
	}

	function setupCoordinateSource() {
		const { coordinateSource } = configuration.value
		if (!coordinateSource) {
			return
		}
		const pluginStore = coreStore.getPluginStore(coordinateSource.pluginName)
		if (!pluginStore) {
			return
		}
		// TODO(dopenguin): Check if {deep: true} is needed as an option for watch
		// redo pin if source (e.g. from addressSearch) changes
		coordinateSourceWatcher = watch(
			() => pluginStore[coordinateSource.getterName],
			(feature) => {
				// NOTE: 'reverse_geocoded' is set as type on reverse geocoded features
				// to prevent infinite loops as in: ReverseGeocode->AddressSearch->Pins->ReverseGeocode.
				if (feature && feature.type !== 'reverse_geocoded') {
					addPin(feature.geometry.coordinates, false, {
						epsg: feature.epsg,
						type: feature.geometry.type,
					})
				}
			}
		)
	}

	function setupInitial() {
		const { initial } = configuration.value
		if (initial) {
			const { coordinate, centerOn, epsg } = initial

			if (centerOn) {
				addPin(coordinate, false, {
					epsg: epsg || (coreStore.configuration.epsg as string),
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

			features.forEach((feature) => {
				const geometryCoordinates = (
					feature.getGeometry() as Point
				).getCoordinates()

				addPin(
					!isCoordinateInBoundaryLayer(
						geometryCoordinates,
						coreStore.map,
						configuration.value.boundary
					)
						? coordinate.value
						: geometryCoordinates
				)
			})
		})
		coreStore.map.addInteraction(translate)
	}

	function click(coordinate: Coordinate) {
		const isDrawing = coreStore.map
			.getInteractions()
			.getArray()
			.some(
				(interaction) =>
					(interaction instanceof Draw &&
						// @ts-expect-error | internal hack to detect it from @polar/plugin-gfi and @polar/plugin-draw
						(interaction._isMultiSelect || interaction._isDrawPlugin)) ||
					interaction instanceof Modify ||
					// @ts-expect-error | internal hack to detect it from @polar/plugin-draw
					interaction._isDeleteSelect
			)
		const { minZoomLevel, movable } = configuration.value
		if (
			(movable === 'drag' || movable === 'click') &&
			// NOTE: It is assumed that getZoom actually returns the currentZoomLevel, thus the view has a constraint in the resolution.
			(coreStore.map.getView().getZoom() as number) >= minZoomLevel &&
			!isDrawing &&
			isCoordinateInBoundaryLayer(
				coordinate,
				coreStore.map,
				configuration.value.boundary
			)
		) {
			addPin(coordinate)
		}
	}

	function addPin(
		newCoordinate: Coordinate,
		clicked = true,
		pinInformation?: {
			epsg: string
			type: Exclude<GeoJsonGeometryTypes, 'GeometryCollection'>
		}
	) {
		// Always clean up other/old pin first – single pin only atm.
		removePin()
		coordinate.value = newCoordinate
		if (!clicked && pinInformation) {
			coordinate.value = getPointCoordinate(
				pinInformation.epsg,
				coreStore.configuration.epsg as string,
				pinInformation.type,
				newCoordinate
			)
			coreStore.map.getView().setCenter(coordinate.value)
			coreStore.map.getView().setZoom(configuration.value.toZoomLevel)
		}
		;(pinLayer.getSource() as Vector).addFeature(
			new Feature({
				geometry: new Point(coordinate.value),
				type: 'point',
				name: 'mapMarker',
				zIndex: 100,
			})
		)
	}

	function removePin() {
		;(pinLayer.getSource() as Vector).clear()
	}

	return {
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
