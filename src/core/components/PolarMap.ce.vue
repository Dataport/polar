<template>
	<div
		ref="polar-map-container"
		class="polar-map"
		tabindex="0"
		role="region"
		:aria-label="$t(($) => $.canvas.label, { ns: 'core' })"
		@wheel="(e) => $emit('wheel', e)"
	/>
</template>

<script setup lang="ts">
import type { Map } from 'ol'

import api from '@masterportal/masterportalapi/src/maps/api'
import { easeOut } from 'ol/easing'
import { defaults } from 'ol/interaction'
import { storeToRefs } from 'pinia'
import { markRaw, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

import { useMainStore } from '../stores/main'
import { checkServiceAvailability } from '../utils/checkServiceAvailability'
import { createKeyboardInteractions } from '../utils/interactions'
import { setupMarkers } from '../utils/map/setupMarkers'
import { setupStyling } from '../utils/map/setupStyling'
import { updateDragAndZoomInteractions } from '../utils/map/updateDragAndZoomInteractions'

const polarMapContainer = useTemplateRef<HTMLDivElement>('polar-map-container')
defineExpose({ el: polarMapContainer })

const emit = defineEmits(['updateListeners', 'wheel'])

const mainStore = useMainStore()
const { hasWindowSize, hasSmallDisplay, center, zoom } = storeToRefs(mainStore)

function onMove() {
	center.value = mainStore.map.getView().getCenter() || center.value
	zoom.value = mainStore.map.getView().getZoom() || zoom.value
}

function createMap() {
	mainStore.map = markRaw(
		api.map.createMap(
			{
				target: polarMapContainer.value,
				extent: undefined,
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
						keyboard: false,
					}),
				},
			}
		) as Map
	)
	mainStore.map.on('moveend', onMove)

	updateDragAndZoomInteractions(
		mainStore.map,
		hasWindowSize.value,
		hasSmallDisplay.value
	)
	createKeyboardInteractions().forEach((interaction) => {
		mainStore.map.addInteraction(interaction)
	})
	emit('updateListeners')
}

// NOTE: Updates can happen if a user resizes the window or the fullscreen plugin is used.
//       Added as a watcher to trigger the update at the correct time.
watch([hasWindowSize, hasSmallDisplay], ([windowSize, smallDisplay]) => {
	updateDragAndZoomInteractions(mainStore.map, windowSize, smallDisplay)
	emit('updateListeners')
})

watch(center, (center) => {
	mainStore.map.getView().animate({
		center,
		duration: 400,
		easing: easeOut,
	})
})

watch(zoom, (zoom) => {
	mainStore.map.getView().animate({ zoom, duration: 300 })
})

onMounted(async () => {
	createMap()
	if (mainStore.configuration.checkServiceAvailability) {
		checkServiceAvailability(mainStore.configuration, mainStore.serviceRegister)
	}
	if (mainStore.configuration.markers) {
		setupMarkers(mainStore.map)
	}
	await setupStyling(
		mainStore.map,
		mainStore.configuration,
		mainStore.serviceRegister
	)
})
onBeforeUnmount(() => {
	mainStore.map.un('moveend', onMove)
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
@import url('ol/ol.css');
</style>

<style scoped>
.polar-map {
	width: 100%;
	height: 100%;
}
</style>
