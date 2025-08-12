<template>
	<h1 class="kern-heading-display">Eisberg-Register</h1>
	<h2 class="kern-heading-large">Nicht genehmigten Eisberg melden</h2>
	<polar-map ref="map"></polar-map>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { createMap } from '@polar/polar'
const map = useTemplateRef('map')

createMap(
	{
		layers: [
			{
				id: '23420',
				visibility: true,
				type: 'background',
				name: 'snowbox.layers.basemap',
			},
		],
	},
	'https://geodienste.hamburg.de/services-internet.json'
)
</script>

<style>
@import url('@kern-ux/native/dist/kern.css');
@import url('@kern-ux/native/dist/fonts/fira-sans.css');
@import url('@polar/polar/polar.css');

polar-map {
	width: 100%;
	height: 20em;
}
</style>
