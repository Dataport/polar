<template>
	<div class="lp-hero__map-frame" aria-label="Interactive POLAR map demo">
		<div id="hero-polar-map" class="lp-hero__map-container" />
	</div>
</template>

<script setup lang="ts">
import type { Feature } from 'ol'

import { createMap } from '@polar/polar/client'
import { toMerged } from 'es-toolkit'
import { onMounted } from 'vue'

import type { MpapiParameters } from '@/lib/getFeatures/types'

const basemapId = '23420'
const basemapGreyId = '23421'
const reports = '6059'
const hamburgBorder = '1693'

const isEvenId = (mmlid: string) => Number(mmlid.slice(-1)) % 2 === 0

const isReportSelectable = (feature: Feature) =>
	(feature.get('features') as Feature[]).reduce(
		(acc: boolean, curr: Feature) =>
			isEvenId(curr.get('mmlid') as string) || acc,
		false
	)

onMounted(async () => {
	await createMap(
		'hero-polar-map',
		'https://geoportal-hamburg.de/lgv-config/services-internet.json',
		{
			startCenter: [565874, 5934140],
			layers: [
				{
					id: basemapId,
					visibility: true,
					type: 'background',
					name: 'Basemap.de (Farbe)',
				},
				{
					id: basemapGreyId,
					type: 'background',
					name: 'Basemap.de (Grau)',
					maxZoom: 6,
				},
				{
					id: hamburgBorder,
					visibility: true,
					hideInMenu: true,
					type: 'mask',
					name: 'Stadtgrenze Hamburg',
				},
				{
					id: reports,
					type: 'mask',
					name: 'Anliegen (MML)',
					visibility: false,
				},
			],
			layout: 'nineRegions',
			checkServiceAvailability: true,
			markers: {
				layers: [
					{
						id: reports,
						defaultStyle: { stroke: '#FFFFFF', fill: '#005CA9' },
						hoverStyle: { stroke: '#46688E', fill: '#8BA1B8' },
						selectionStyle: { stroke: '#FFFFFF', fill: '#E10019' },
						unselectableStyle: { stroke: '#FFFFFF', fill: '#333333' },
						isSelectable: isReportSelectable,
					},
				],
				clusterClickZoom: true,
			},
			scale: { showScaleSwitcher: true },
			addressSearch: {
				searchMethods: [
					{
						type: 'mpapi',
						url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
						queryParameters: {
							searchStreets: true,
							searchHouseNumbers: true,
						} as MpapiParameters,
					},
				],
				minLength: 3,
				waitMs: 300,
				focusAfterSearch: true,
				groupProperties: {
					defaultGroup: { label: 'Address', limitResults: 5 },
				},
			},
			pins: {
				coordinateSources: [{ plugin: 'addressSearch', key: 'chosenAddress' }],
				boundary: { layerId: hamburgBorder },
				movable: 'drag',
				style: { fill: '#FF0019' },
				toZoomLevel: 7,
			},
			reverseGeocoder: {
				url: 'https://geodienste.hamburg.de/HH_WPS',
				coordinateSources: [{ plugin: 'pins', key: 'coordinate' }],
				addressTarget: { plugin: 'addressSearch', key: 'selectResult' },
				zoomTo: 7,
			},
			geoLocation: {
				checkLocationInitially: false,
				keepCentered: false,
				showTooltip: true,
				zoomLevel: 7,
			},
		},
		[
			'addressSearch',
			'fullscreen',
			'geoLocation',
			'iconMenu',
			'layerChooser',
			'loadingIndicator',
			'pins',
			'reverseGeocoder',
			'scale',
			'toast',
		],
		(serviceRegister) =>
			serviceRegister.map((entry) =>
				entry.id === reports ? toMerged(entry, { clusterDistance: 20 }) : entry
			)
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
