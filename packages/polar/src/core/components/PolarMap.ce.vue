<script setup lang="ts">
import api from '@masterportal/masterportalapi/src/maps/api'
import { defaults } from 'ol/interaction'
import { onMounted, useHost, useTemplateRef } from 'vue'

import { KolButton } from '@public-ui/vue'

const polarMapContainer = useTemplateRef('polar-map-container')

function init(config) {
	const map = api.map.createMap(
		{
			target: polarMapContainer.value,
			...config,
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
}

onMounted(() => {
	const host = useHost()
	host.init = init
})

function demo() {
	console.log('Button clicked')
}
</script>

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
