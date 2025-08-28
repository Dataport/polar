<template>
	<h1 class="kern-heading-display">Eisberg-Register</h1>
	<h2 class="kern-heading-large">Nicht genehmigten Eisberg melden</h2>
	<LayoutChooser v-model="mapConfiguration.layout" />
	<pre>{{ mapConfiguration }}</pre>
	<polar-map
		ref="map"
		:map-configuration="mapConfiguration"
		:service-register="serviceRegister"
	/>
</template>

<script setup lang="ts">
import { onMounted, reactive, useTemplateRef } from 'vue'
import type { MapConfiguration } from '@polar/polar'
import pluginFullscreen from '@polar/polar/plugins/fullscreen'
import LayoutChooser from './components/LayoutChooser.vue'

const map = useTemplateRef('map')
onMounted(() => {
	if (!map.value?.store) {
		return
	}
	const store = map.value.store
	store.addPlugin(pluginFullscreen())
})

const mapConfiguration = reactive<MapConfiguration>({
	layers: [
		{
			id: '23420',
			visibility: true,
			type: 'background',
			name: 'snowbox.layers.basemap',
		},
	],
	startCenter: [0, 0],
	layout: 'nineRegions',
	fullscreen: {
		displayComponent: true,
		layoutTag: 'TOP_RIGHT',
	},
})

const serviceRegister = 'https://geodienste.hamburg.de/services-internet.json'
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
@import url('@kern-ux/native/dist/kern.css');
@import url('@kern-ux/native/dist/fonts/fira-sans.css');
@import url('@polar/polar/polar.css');

polar-map {
	width: 100%;
	height: 20em;
}
</style>
