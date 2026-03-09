<template>
	<div class="lp-hero__map-frame" aria-label="Interactive POLAR map demo">
		<div id="hero-polar-map" class="lp-hero__map-container" />
	</div>
</template>

<script setup lang="ts">
import { addPlugin, createMap } from '@polar/polar'
import pluginAddressSearch from '@polar/polar/plugins/addressSearch'
import pluginFooter from '@polar/polar/plugins/footer'
import pluginFullscreen from '@polar/polar/plugins/fullscreen'
import pluginGeoLocation from '@polar/polar/plugins/geoLocation'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginLayerChooser from '@polar/polar/plugins/layerChooser'
import pluginLoadingIndicator from '@polar/polar/plugins/loadingIndicator'
import pluginPins from '@polar/polar/plugins/pins'
import pluginReverseGeocoder from '@polar/polar/plugins/reverseGeocoder'
import pluginScale from '@polar/polar/plugins/scale'
import { onMounted } from 'vue'

import type { MpapiParameters } from '@/lib/getFeatures/types'

import CoordinateDisplay from './CoordinateDisplay.vue'

const serviceRegister = [
	{
		id: '23420',
		name: 'basemap.de Web Raster Farbe',
		url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
		typ: 'WMS',
		layers: 'de_basemapde_web_raster_farbe',
		format: 'image/png',
		version: '1.3.0',
		singleTile: false,
		transparent: true,
		transparency: 0,
		tilesize: 512,
		gutter: 0,
		minScale: '0',
		maxScale: '2500000',
		cache: false,
	},
	{
		id: '23421',
		name: 'basemap.de Web Raster Grau',
		url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
		typ: 'WMS',
		layers: 'de_basemapde_web_raster_grau',
		format: 'image/png',
		version: '1.3.0',
		singleTile: false,
		transparent: true,
		transparency: 0,
		tilesize: 512,
		gutter: 0,
		minScale: '0',
		maxScale: '2500000',
		cache: false,
	},
]

onMounted(async () => {
	const map = await createMap(
		'hero-polar-map',
		{
			startCenter: [565874, 5934140],
			layers: [
				{
					id: '23420',
					visibility: true,
					type: 'background',
					name: 'Basemap.de (Farbe)',
				},
				{
					id: '23421',
					type: 'background',
					name: 'Basemap.de (Grau)',
				},
			],
			layout: 'standard',
			scale: {
				showScaleSwitcher: true,
			},
		},
		serviceRegister
	)

	addPlugin(map, pluginLoadingIndicator({}))

	addPlugin(
		map,
		pluginAddressSearch({
			searchMethods: [
				{
					type: 'mpapi',
					url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
					queryParameters: {
						epsg: 'EPSG:25832',
						searchStreets: true,
						searchHouseNumbers: true,
					} as MpapiParameters,
				},
			],
			minLength: 3,
			waitMs: 300,
			focusAfterSearch: true,
			groupProperties: {
				defaultGroup: {
					label: 'Address',
					limitResults: 5,
				},
			},
		})
	)

	addPlugin(
		map,
		pluginPins({
			coordinateSources: [{ plugin: 'addressSearch', key: 'chosenAddress' }],
			movable: 'drag',
			style: { fill: '#FF0019' },
			toZoomLevel: 7,
		})
	)

	addPlugin(
		map,
		pluginReverseGeocoder({
			url: 'https://geodienste.hamburg.de/HH_WPS',
			coordinateSources: [{ plugin: 'pins', key: 'coordinate' }],
			addressTarget: { plugin: 'addressSearch', key: 'selectResult' },
			zoomTo: 7,
		})
	)

	addPlugin(
		map,
		pluginIconMenu({
			displayComponent: true,
			layoutTag: 'TOP_RIGHT',
			initiallyOpen: 'layerChooser',
			menus: [
				[{ plugin: pluginFullscreen({}) }, { plugin: pluginLayerChooser({}) }],
				[
					{
						plugin: pluginGeoLocation({
							checkLocationInitially: false,
							keepCentered: false,
							showTooltip: true,
							zoomLevel: 7,
						}),
					},
				],
			],
		})
	)

	addPlugin(
		map,
		pluginFooter({
			leftEntries: [
				{ id: 'external-coordinateDisplay', component: CoordinateDisplay },
			],
			rightEntries: [pluginScale({})],
		})
	)
})
</script>

<style scoped>
.lp-hero__map-frame {
	background: #fff;
	border-radius: 1.5rem;
	overflow: hidden;
	box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45);
}

.lp-hero__map-container {
	width: 100%;
	height: 480px;
}
</style>
