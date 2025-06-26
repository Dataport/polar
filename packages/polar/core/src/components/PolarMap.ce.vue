<template lang="pug">
	.polar-wrapper
		.polar-map(
			ref="polar-map-container"
			tabindex="0"
			role="region"
			:aria-label="$t('canvas.label')"
		)
		KolButton(
			:_label="$t('canvas.label')"
			@click="demo"
		)
</template>

<script setup lang="ts">
import { KolButton } from '@public-ui/vue'
import { defaults } from 'ol/interaction'
import { onMounted, useTemplateRef } from 'vue'
import { useCoreStore } from '../store/useCoreStore'
import { mapZoomOffset } from '../utils/mapZoomOffset'
import api from '@masterportal/masterportalapi/src/maps/api'

const coreStore = useCoreStore()

const polarMapContainer = useTemplateRef('polar-map-container')

const maxAttempts = 10
const waitTime = 500
let counter = 0

function createMap() {
	const intervalId = setInterval(() => {
		if (coreStore.configuration.layerConf.length === 0) {
			if (counter > maxAttempts) {
				clearInterval(intervalId)
				console.error(
					`@polar/core: No layer configuration "layerConf" defined after maximum (${counter}) attempts. No layers will be rendered.`
				)
				return
			}
			console.error(
				`@polar/core: No layer configuration "layerConf" defined. Trying again in ${waitTime}ms...`
			)
			counter++
		} else {
			clearInterval(intervalId)
			const map = api.map.createMap(
				{
					target: polarMapContainer.value,
					...mapZoomOffset(coreStore.configuration),
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
			)
			coreStore.setMap(map)
		}
	}, waitTime)
}

onMounted(() => {
	createMap()
})

function demo() {
	console.log('Button clicked')
}
</script>

<style lang="scss">
:host {
	display: block;
	width: 100%;
	height: 20em;
	margin: 1em 0;
}
</style>

<style scoped lang="scss">
.polar-wrapper {
	height: 100%;
	width: 100%;

	.polar-map {
		width: 100%;
		height: 100%;
	}
}
</style>
