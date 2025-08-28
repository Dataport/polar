<template>
	<PolarMapOverlay ref="polar-map-overlay" />
	<div
		ref="polar-map-container"
		class="polar-map"
		tabindex="0"
		role="region"
		:aria-label="$t(($) => $.canvas.label, { ns: 'core' })"
		@wheel="wheelEffect"
	/>
</template>

<script setup lang="ts">
import api from '@masterportal/masterportalapi/src/maps/api'
import { rawLayerList } from '@masterportal/masterportalapi'
import Hammer from 'hammerjs'
import { defaults } from 'ol/interaction'
import { storeToRefs } from 'pinia'
import { computed, markRaw, onMounted, useTemplateRef, watch } from 'vue'
import type { Map } from 'ol'
import { easeOut } from 'ol/easing'
import { t } from 'i18next'
import { useMainStore } from '../stores/main'

import { updateDragAndZoomInteractions } from '../utils/map/updateDragAndZoomInteractions'
import { setupStyling } from '../utils/map/setupStyling'

import { checkServiceAvailability } from '../utils/checkServiceAvailability'
import { setupMarkers } from '../utils/map/setupMarkers'
import PolarMapOverlay from './PolarMapOverlay.ce.vue'

const mainStore = useMainStore()
const { hasWindowSize, hasSmallDisplay, center, zoom } = storeToRefs(mainStore)

const polarMapContainer = useTemplateRef<HTMLDivElement>('polar-map-container')
const overlay = useTemplateRef<typeof PolarMapOverlay>('polar-map-overlay')

let map: Map | null = null

function onMove() {
	if (!map) {
		return
	}
	center.value = map.getView().getCenter() || center.value
	zoom.value = map.getView().getZoom() || zoom.value
}

function createMap() {
	map = api.map.createMap(
		{
			target: polarMapContainer.value,
			...mainStore.configuration,
			layerConf: mainStore.serviceRegister,
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
	updateListeners()
	mainStore.map = markRaw(map)
}

// NOTE: Updates can happen if a user resizes the window or the fullscreen plugin is used.
//       Added as a watcher to trigger the update at the correct time.
watch(hasWindowSize, (value) => {
	if (!map) {
		return
	}
	updateDragAndZoomInteractions(map, value, hasSmallDisplay.value)
})

watch(center, (center) => {
	if (!map) {
		return
	}
	map.getView().animate({
		center,
		duration: 400,
		easing: easeOut,
	})
})

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1
function wheelEffect(event: WheelEvent) {
	if (hasWindowSize.value || !overlay.value) {
		return
	}
	const condition = computed(() => !hasWindowSize.value)
	if (isMacOS && !event.metaKey) {
		overlay.value.show(
			t(($) => $.overlay.noCommandOnZoom, { ns: 'core' }),
			condition
		)
	} else if (!isMacOS && !event.ctrlKey) {
		overlay.value.show(
			t(($) => $.overlay.noControlOnZoom, { ns: 'core' }),
			condition
		)
	}
}

onMounted(async () => {
	if (typeof mainStore.serviceRegister === 'string') {
		mainStore.serviceRegister = await new Promise<Record<string, unknown>[]>(
			(resolve) =>
				rawLayerList.initializeLayerList(mainStore.serviceRegister, resolve)
		)
	}

	createMap()
	if (mainStore.configuration.checkServiceAvailability) {
		checkServiceAvailability(mainStore.configuration, mainStore.serviceRegister)
	}
	if (map && mainStore.configuration.markers) {
		setupMarkers(map)
	}
	if (map && Array.isArray(mainStore.serviceRegister)) {
		await setupStyling(map, mainStore.configuration, mainStore.serviceRegister)
	}
})

function updateListeners() {
	if (
		!hasWindowSize.value &&
		polarMapContainer.value &&
		mainStore.hasSmallDisplay
	) {
		new Hammer(polarMapContainer.value).on('pan', (e) => {
			if (
				overlay.value &&
				e.maxPointers === 1 &&
				map &&
				map
					.getInteractions()
					.getArray()
					.some((interaction) => interaction.get('_isPolarDragLikeInteraction'))
			) {
				overlay.value.show(t(($) => $.overlay.oneFingerPan, { ns: 'core' }))
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
