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
import Hammer from 'hammerjs'
import { defaults } from 'ol/interaction'
import { storeToRefs } from 'pinia'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import type { Map } from 'ol'
import { easeOut } from 'ol/easing'
import { t } from 'i18next'
import { useMainStore } from '../stores/main'

import { checkServiceAvailability } from '../utils/checkServiceAvailability'
import { updateDragAndZoomInteractions } from '../utils/map/updateDragAndZoomInteractions'
import { setupStyling } from '../utils/map/setupStyling'
import { setupMarkers } from '../utils/map/setupMarkers'
import { useT } from '../composables/useT'
import PolarMapOverlay from './PolarMapOverlay.ce.vue'

const mainStore = useMainStore()
const { hasWindowSize, hasSmallDisplay, center, zoom } = storeToRefs(mainStore)

const polarMapContainer = useTemplateRef<HTMLDivElement>('polar-map-container')
const overlay = useTemplateRef<typeof PolarMapOverlay>('polar-map-overlay')

function onMove() {
	center.value = mainStore.map.getView().getCenter() || center.value
	zoom.value = mainStore.map.getView().getZoom() || zoom.value
}

function createMap() {
	mainStore.map = api.map.createMap(
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
	mainStore.map.on('moveend', onMove)

	updateDragAndZoomInteractions(
		mainStore.map,
		hasWindowSize.value,
		hasSmallDisplay.value
	)
	updateListeners()
}

// NOTE: Updates can happen if a user resizes the window or the fullscreen plugin is used.
//       Added as a watcher to trigger the update at the correct time.
watch(hasWindowSize, (value) => {
	updateDragAndZoomInteractions(mainStore.map, value, hasSmallDisplay.value)
})

watch(center, (center) => {
	mainStore.map.getView().animate({
		center,
		duration: 400,
		easing: easeOut,
	})
})

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1
const noCommandOnZoom = useT(() =>
	t(($) => $.overlay.noCommandOnZoom, { ns: 'core' })
)
const noControlOnZoom = useT(() =>
	t(($) => $.overlay.noControlOnZoom, { ns: 'core' })
)
function wheelEffect(event: WheelEvent) {
	if (hasWindowSize.value || !overlay.value) {
		return
	}
	const condition = computed(() => !hasWindowSize.value)
	if (isMacOS && !event.metaKey) {
		overlay.value.show(noCommandOnZoom, condition)
	} else if (!isMacOS && !event.ctrlKey) {
		overlay.value.show(noControlOnZoom, condition)
	}
}

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

const oneFingerPan = useT(() =>
	t(($) => $.overlay.oneFingerPan, { ns: 'core' })
)
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
				mainStore.map
					.getInteractions()
					.getArray()
					.some((interaction) => interaction.get('_isPolarDragLikeInteraction'))
			) {
				overlay.value.show(oneFingerPan)
			}
		})
	}
}

watch(hasWindowSize, updateListeners)
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
