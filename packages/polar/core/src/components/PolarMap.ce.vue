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

function createMap() {
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
