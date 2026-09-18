import type { createMap } from '@polar/polar/client'
import type { MpapiParameters } from '@/lib/getFeatures/types'

import featureStylesUrl from '../style.json?url'

export const heroMapContainerId = 'hero-polar-map'
export const heroMapServiceRegisterUrl =
	'https://geoportal-hamburg.de/lgv-config/services-internet.json'

const basemapId = '23420'
const basemapGreyId = '23421'
const hamburgBorder = '1693'

export const heroMapConfiguration: Parameters<typeof createMap>[2] = {
	colorScheme: 'light',
	language: 'en',
	startCenter: [565874, 5934140],
	layers: [
		{
			id: basemapId,
			visibility: true,
			type: 'background',
			name: 'Basemap.de (Colour)',
		},
		{
			id: basemapGreyId,
			type: 'background',
			name: 'Basemap.de (Gray)',
			maxZoom: 6,
		},
		{
			id: hamburgBorder,
			visibility: true,
			hideInMenu: false,
			type: 'mask',
			name: 'Border of Hamburg',
			styleId: 'hamburg-border',
		},
	],
	layout: 'nineRegions',
	checkServiceAvailability: true,
	featureStyles: featureStylesUrl,
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
		type: 'wps',
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
}
