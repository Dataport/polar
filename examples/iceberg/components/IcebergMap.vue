<template>
	<polar-map
		ref="map"
		:map-configuration="store.mapConfiguration"
		:service-register="store.serviceRegister"
	/>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

import { addPlugins } from '@polar/polar'
import type { PolarContainer } from '@polar/polar'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginFullscreen from '@polar/polar/plugins/fullscreen'
import pluginToast from '@polar/polar/plugins/toast'

import { useIcebergStore } from '../stores/iceberg'

const store = useIcebergStore()

const map = useTemplateRef<typeof PolarContainer>('map')
onMounted(() => {
	if (!map.value) {
		return
	}
	addPlugins(map.value, [
		pluginIconMenu({
			displayComponent: true,
			layoutTag: 'TOP_RIGHT',
			menus: [
				{
					plugin: pluginFullscreen(),
					hint: 'Full of yourself',
				},
			],
		}),
		pluginToast({
			displayComponent: true,
			layoutTag: 'BOTTOM_MIDDLE',
		}),
	])
})
</script>

<style scoped>
@import url('@polar/polar/polar.css');

polar-map {
	width: 100%;
	height: 20em;
}
</style>
