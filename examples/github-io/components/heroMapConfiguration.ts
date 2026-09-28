import type { createMap } from '@polar/polar/client'
import type { MpapiParameters } from '@/lib/getFeatures/types'

import featureStylesUrl from '../style.json?url'

export const heroMapContainerId = 'hero-polar-map'
export const heroMapServiceRegisterUrl =
	'https://geoportal-hamburg.de/lgv-config/services-internet.json'

const basemapId = '23420'
const basemapGreyId = '23421'
const hamburgBorder = '1693'
const droneNoFlyZonesAirfields = '4570'
const droneNoFlyZonesHospitals = '4568'

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
		{
			id: droneNoFlyZonesAirfields,
			type: 'mask',
			name: 'Drohnenflugverbotszonen Flugplätze',
		},
		{
			id: droneNoFlyZonesHospitals,
			type: 'mask',
			name: 'Drohnenflugverbotszonen Krankenhäuser',
		},
	],
	layout: 'nineRegions',
	checkServiceAvailability: true,
	featureStyles: featureStylesUrl,
	fullscreen: {},
	attributions: {
		displayComponent: true,
		initiallyOpen: false,
		listenToChanges: [
			{
				key: 'activeBackgroundId',
				plugin: 'layerChooser',
			},
			{
				key: 'activeMaskIds',
				plugin: 'layerChooser',
			},
			{
				key: 'zoom',
			},
		],
		layerAttributions: [
			{
				id: basemapId,
				title: 'Basemap © basemap.de / BKG <MONTH> <YEAR>',
			},
			{
				id: basemapGreyId,
				title: 'Basemap Grey © basemap.de / BKG <MONTH> <YEAR>',
			},
			{
				id: hamburgBorder,
				title: 'Border of Hamburg © Freie und Hansestadt Hamburg',
			},
			{
				id: droneNoFlyZonesAirfields,
				title:
					'Drohnenflugverbotszonen Flugplätze © Freie und Hansestadt Hamburg',
			},
			{
				id: droneNoFlyZonesHospitals,
				title:
					'Drohnenflugverbotszonen Krankenhäuser © Freie und Hansestadt Hamburg',
			},
		],
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
