<template>
	<PolarMapOverlay ref="polar-map-overlay" />
	<div
		ref="polar-map-container"
		class="polar-map"
		tabindex="0"
		role="region"
		:aria-label="$t('canvas.label')"
		@wheel="wheelEffect"
	/>
</template>

<script setup lang="ts">
import api from '@masterportal/masterportalapi/src/maps/api'
import { rawLayerList } from '@masterportal/masterportalapi'
import Hammer from 'hammerjs'
import { defaults } from 'ol/interaction'
import { storeToRefs } from 'pinia'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import type { Map } from 'ol'
import { easeOut } from 'ol/easing'
import { useMainStore } from '../stores/main'
import { useMarkerStore } from '../stores/marker'

import { updateDragAndZoomInteractions } from '../utils/map/updateDragAndZoomInteractions'
import { updateSizeOnReady } from '../utils/map/updateSizeOnReady'
import { setupStyling } from '../utils/map/setupStyling'

import { checkServiceAvailability } from '../utils/checkServiceAvailability'
import PolarMapOverlay from './PolarMapOverlay.ce.vue'

const coreStore = useMainStore()
const { hasWindowSize, hasSmallDisplay, center, zoom, mapHasDimensions } =
	storeToRefs(coreStore)

const polarMapContainer = useTemplateRef<HTMLDivElement>('polar-map-container')
const overlay = useTemplateRef<typeof PolarMapOverlay>('polar-map-overlay')

let map: Map | null = null

function onMove() {
	if (!map) return
	center.value = map.getView().getCenter() || center.value
	zoom.value = map.getView().getZoom() || zoom.value
}

function createMap() {
	map = api.map.createMap(
		{
			target: polarMapContainer.value,
			...coreStore.configuration,
			layerConf: coreStore.serviceRegister,
		},
		'2D',
		{
			mapParams: {
				interactions: defaults({
					altShiftDragRotate: false,
					pinchRotate: false,
					dragPan: false,
					mouseWheelZoom: false,
				}),
			},
		}
	) as Map
	map.on('moveend', onMove)

	updateDragAndZoomInteractions(map, hasWindowSize.value, hasSmallDisplay.value)
	updateSizeOnReady(map)
		.then(() => {
			// OL prints warnings – add this log to reduce confusion
			// eslint-disable-next-line no-console
			console.log(`The map now has dimensions and can be rendered.`)
			mapHasDimensions.value = true
		})
		.catch(() => {
			console.error(
				`The POLAR map client could not update its size. The map is probably invisible due to having 0 width or 0 height. This might be a CSS issue – please check the wrapper's size.`
			)
		})

	updateListeners()

	coreStore.setMap(map)
}

// NOTE: Updates can happen if a user resizes the window or the fullscreen plugin is used.
//       Added as a watcher to trigger the update at the correct time.
watch(hasWindowSize, (value) => {
	if (!map) return
	updateDragAndZoomInteractions(map, value, hasSmallDisplay.value)
})

watch(center, (center) => {
	if (!map) return
	map.getView().animate({
		center,
		duration: 400,
		easing: easeOut,
	})
})

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1
function wheelEffect(event: WheelEvent) {
	if (hasWindowSize.value) return
	const condition = computed(() => !hasWindowSize.value)
	if (isMacOS && !event.metaKey) {
		overlay.value?.show('overlay.noCommandOnZoom', condition)
	} else if (!isMacOS && !event.ctrlKey) {
		overlay.value?.show('overlay.noControlOnZoom', condition)
	}
}

onMounted(async () => {
	if (typeof coreStore.serviceRegister === 'string') {
		coreStore.serviceRegister = await new Promise<Record<string, unknown>[]>(
			(resolve) =>
				rawLayerList.initializeLayerList(coreStore.serviceRegister, resolve)
		)
	}

	createMap()
	if (coreStore.configuration.checkServiceAvailability) {
		checkServiceAvailability(coreStore.configuration, coreStore.serviceRegister)
	}
	if (coreStore.configuration.markers) {
		useMarkerStore().setupMarkers(coreStore.configuration.markers)
	}
	if (map && Array.isArray(coreStore.serviceRegister)) {
		await setupStyling(map, coreStore.configuration, coreStore.serviceRegister)
	}
})

function updateListeners() {
	if (
		!hasWindowSize.value &&
		polarMapContainer.value &&
		coreStore.hasSmallDisplay
	) {
		new Hammer(polarMapContainer.value).on('pan', (e) => {
			if (
				e.maxPointers === 1 &&
				map &&
				map
					.getInteractions()
					.getArray()
					.some((interaction) => interaction.get('_isPolarDragLikeInteraction'))
			) {
				overlay.value?.show('overlay.oneFingerPan')
			}
		})
	}
}

watch(hasWindowSize, updateListeners)
</script>

<style>
@import url('ol/ol.css');
</style>

<style scoped>
.polar-map {
	width: 100%;
	height: 100%;
}
</style>
