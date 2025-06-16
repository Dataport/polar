<script setup lang="ts">
import { onMounted, useHost, useTemplateRef } from 'vue'
import api from '@masterportal/masterportalapi/src/maps/api'

const polarMapContainer = useTemplateRef('polar-map-container')

function init(config) {
	const map = api.map.createMap({
		target: polarMapContainer.value,
		...config,
	}, '2D', {
		mapParams: {},
	})
}

onMounted(() => {
	const host = useHost()
	host.init = init
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
