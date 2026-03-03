import { updateState } from '@polar/polar'
import { createMap } from '@polar/polar/client'
import { toMerged } from 'es-toolkit'

const basemapId = '23420'
const basemapGreyId = '23421'
const reports = '6059'
const hamburgBorder = '1693'

let colorScheme = 'light'

// arbitrary condition for testing
const isEvenId = (mmlid) => Number(mmlid.slice(-1)) % 2 === 0

// NOTE: This function is only usable if the layer is clustered
const isReportSelectable = (feature) =>
	feature
		.get('features')
		.reduce(
			(accumulator, current) => isEvenId(current.get('mmlid')) || accumulator,
			false
		)

const map = await createMap(
	'polarstern',
	'https://geoportal-hamburg.de/lgv-config/services-internet.json',
	{
		colorScheme,
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
					defaultStyle: {
						stroke: '#FFFFFF',
						fill: '#005CA9',
					},
					hoverStyle: {
						stroke: '#46688E',
						fill: '#8BA1B8',
					},
					selectionStyle: {
						stroke: '#FFFFFF',
						fill: '#E10019',
					},
					unselectableStyle: {
						stroke: '#FFFFFF',
						fill: '#333333',
					},
					isSelectable: isReportSelectable,
				},
			],
			clusterClickZoom: true,
		},
		scale: {
			showScaleSwitcher: true,
		},
		addressSearch: {
			searchMethods: [
				{
					queryParameters: {
						searchStreets: true,
						searchHouseNumbers: true,
					},
					type: 'mpapi',
					url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
				},
			],
			minLength: 3,
			waitMs: 300,
			focusAfterSearch: true,
			groupProperties: {
				defaultGroup: {
					limitResults: 5,
				},
			},
		},
		pins: {
			coordinateSources: [{ plugin: 'addressSearch', key: 'chosenAddress' }],
			boundary: {
				layerId: hamburgBorder,
			},
			movable: 'drag',
			style: {
				fill: '#FF0019',
			},
			toZoomLevel: 7,
		},
		reverseGeocoder: {
			url: 'https://geodienste.hamburg.de/HH_WPS',
			coordinateSources: [
				{
					plugin: 'pins',
					key: 'coordinate',
				},
			],
			addressTarget: {
				plugin: 'addressSearch',
				key: 'selectResult',
			},
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

/* simple language switcher attached for demo purposes;
 * language switching is considered a global concern and
 * should be handled by the leading application */
document
	.getElementById('language-switcher')
	?.addEventListener('change', (event) => {
		const target = event.target
		const { value } = target
		updateState(map, 'core', 'language', value)
		target[0].innerHTML = value === 'en' ? 'English' : 'Englisch'
		target[1].innerHTML = value === 'en' ? 'German' : 'Deutsch'
	})

document
	.getElementById('color-scheme-switcher')
	?.addEventListener('click', ({ target }) => {
		target.innerHTML = `Switch to ${colorScheme} mode`
		colorScheme = colorScheme === 'light' ? 'dark' : 'light'
		updateState(map, 'core', 'colorScheme', colorScheme)
	})
