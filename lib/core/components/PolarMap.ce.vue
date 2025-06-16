<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import api from '@masterportal/masterportalapi/src/maps/api'

const polarMapContainer = useTemplateRef('polar-map-container')

const basemapId = '23420'
const basemapGreyId = '23421'

onMounted(() => {
	const map = api.map.createMap({
		target: polarMapContainer.value,
		layers: [
			{
				id: basemapId,
				visibility: true,
				type: 'background',
				name: 'snowbox.layers.basemap',
			},
			{
				id: basemapGreyId,
				type: 'background',
				name: 'snowbox.layers.basemapGrey',
			},
		],
	}, '2D', {
		mapParams: {},
	})
})
</script>

<template lang="pug">
.polar-wrapper
	.polar-map(
		ref="polar-map-container"
		tabindex="0"
		role="region"
	)
</template>

<style scoped lang="scss">
.polar-wrapper {
	position: absolute;
	height: 100%;
	width: 100%;

	.polar-map {
		width: 100%;
		height: 100%;
	}
}
</style>
