import {
	addPlugin,
	createMap,
	createMapElement,
	getStore,
	removePlugin,
	subscribe,
	updateState,
} from '@polar/polar'
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
import pluginToast from '@polar/polar/plugins/toast'

import EmptyComponent from './EmptyComponent.vue'
import MockAttributions from './MockAttributions.ce.vue'
import MockPointerPosition from './MockPointerPosition.ce.vue'
import services from './services.js'
import styleJsonUrl from './style.json?url'
import YetAnotherEmptyComponent from './YetAnotherEmptyComponent.vue'

const basemapId = '23420'
const basemapGreyId = '23421'
const ausgleichsflaechen = '1454'
const reports = '6059'
const denkmal = 'denkmaelerWMS'
const hamburgBorder = '1693'

let colorScheme = 'light'
// eslint-disable-next-line no-unused-vars
const dataportTheme = {
	brandColor: {
		l: '0.4671',
		c: '0.1532',
		h: '24.57',
	},
	kern: {
		color: {
			action: {
				default:
					'oklch(var(--brand-color-l) var(--brand-color-c) var(--brand-color-h))',
				stateIndicator: {
					shade: {
						hover:
							'oklch(calc(var(--brand-color-l) + 0.1) var(--brand-color-c) var(--brand-color-h))',
						active:
							'oklch(calc(var(--brand-color-l) + 0.14) var(--brand-color-c) var(--brand-color-h))',
					},
				},
			},
		},
		metric: {
			space: {
				default: '24px',
			},
			borderRadius: {
				default: '0 10px 10px 10px',
			},
		},
		typography: {
			font: {
				family: {
					default: 'Consolas',
				},
			},
		},
	},
}

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
	'snowbox',
	{
		colorScheme,
		startCenter: [565874, 5934140],
		layers: [
			// TODO: Add internalization to snowbox
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
			{
				id: ausgleichsflaechen,
				type: 'mask',
				name: 'Ausgleichsflächen',
				styleId: 'panda',
				visibility: true,
				minZoom: 5,
			},
			{
				id: denkmal,
				type: 'mask',
				name: 'Kulturdenkmale',
				visibility: true,
				options: {
					layers: {
						order: '6,24,25,4,3,2,1,0',
						title: {
							6: 'Denkmalbereich',
							24: 'Mehrheit von baulichen Anlagen',
							25: 'Sachgesamtheit',
							4: 'Baudenkmal',
							3: 'Gründenkmal',
							2: 'Gewässer',
							1: 'Baudenkmal (Fläche)',
							0: 'Gründenkmal (Fläche)',
						},
						legend: true,
					},
				},
			},
		],
		layout: 'standard',
		checkServiceAvailability: true,
		featureStyles: styleJsonUrl,
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
		// theme: dataportTheme,
		/*
			TODO(dopenguin): Surrounding application should be able give information about dark or light mode via update of a state parameter; light mode by default
		 */
		locales: [
			{
				type: 'de',
				resources: {
					fullscreen: {
						button: {
							label_on: 'Mach groß',
							label_off: 'Mach klein',
						},
					},
					iconMenu: {
						hints: {
							attributions: 'LMAO',
							fullscreen: 'BEEEEEG YOSHEEEEE',
						},
					},
				},
			},
		],
		scale: {
			showScaleSwitcher: true,
		},
	},
	services
)

document.getElementById('secondMap').addEventListener('click', async () => {
	const secondMap = createMapElement(
		{
			startCenter: [573364, 6028874],
			layers: [
				{
					id: basemapId,
					visibility: true,
					type: 'background',
					name: 'snowbox.layers.basemap',
				},
			],
		},
		services
	)
	secondMap.classList.add('snowbox')
	document.getElementById('secondMapContainer').appendChild(secondMap)
	addPlugin(
		secondMap,
		pluginFullscreen({
			layoutTag: 'TOP_RIGHT',
		})
	)
})
document.getElementById('secondMapClean').addEventListener('click', () => {
	document.getElementById('secondMapContainer').innerText = ''
})

addPlugin(
	map,
	pluginToast({
		displayComponent: true,
		layoutTag: 'BOTTOM_MIDDLE',
	})
)

setTimeout(() => {
	removePlugin(map, 'toast')
}, 3000)

setTimeout(() => {
	addPlugin(
		map,
		pluginToast({
			displayComponent: true,
			layoutTag: 'BOTTOM_MIDDLE',
		})
	)
	const toastStore = getStore(map, 'toast')
	toastStore.addToast({
		text: 'Sechs Sekunden',
		severity: 'info',
	})
}, 6000)

addPlugin(
	map,
	pluginLoadingIndicator({
		loaderStyle: 'BasicLoader',
	})
)
addPlugin(
	map,
	pluginAddressSearch({
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
	})
)
addPlugin(
	map,
	pluginPins({
		coordinateSources: [{ plugin: 'addressSearch', key: 'chosenAddress' }],
		boundary: {
			layerId: hamburgBorder,
		},
		movable: 'drag',
		style: {
			fill: '#FF0019',
		},
		toZoomLevel: 7,
	})
)
addPlugin(
	map,
	pluginReverseGeocoder({
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
	})
)
addPlugin(
	map,
	pluginIconMenu({
		displayComponent: true,
		layoutTag: 'TOP_RIGHT',
		initiallyOpen: 'layerChooser',
		focusMenus: [
			{
				plugin: {
					component: YetAnotherEmptyComponent,
					id: 'attributions',
					locales: [],
				},
				icon: 'kern-icon--near-me',
			},
		],
		menus: [
			// TODO: Delete the mock plugins including the components once the correct plugins have been implemented
			[
				{
					plugin: pluginFullscreen({}),
				},
				{
					plugin: pluginLayerChooser({}),
				},
			],
			[
				{
					plugin: {
						component: EmptyComponent,
						id: 'realKewl',
						locales: [],
					},
					icon: 'kern-icon-fill--share',
				},
			],
			[
				{
					plugin: pluginGeoLocation({
						checkLocationInitially: false,
						keepCentered: true,
						showTooltip: true,
						zoomLevel: 7,
						// usable when you're in HH or fake your geolocation to HH
						/* boundary: {
							layerId: hamburgBorder,
							onError: 'strict',
						}, */
					}),
				},
			],
		],
	})
)
addPlugin(
	map,
	pluginFooter({
		leftEntries: [{ id: 'mockPointer', component: MockPointerPosition }],
		rightEntries: [
			pluginScale({}),
			{ id: 'mockAttributions', component: MockAttributions },
		],
	})
)

const toastStore = getStore(map, 'toast')
toastStore.addToast({
	text: 'Hallo Welt',
	severity: 'info',
})
toastStore.addToast({
	text: 'Achtung! Dies ist ein Toast!',
	severity: 'error',
})

const loadingIndicatorStore = getStore(map, 'loadingIndicator')
loadingIndicatorStore.addLoadingKey('loadingTest')
setTimeout(() => loadingIndicatorStore.removeLoadingKey('loadingTest'), 2000)

subscribe(
	map,
	'core',
	'selectedCoordinates',
	(coordinates) =>
		(document.getElementById('selected-feature-coordinates').innerText =
			JSON.stringify(coordinates))
)

/* simple language switcher attached for demo purposes;
 * language switching is considered a global concern and
 * should be handled by the leading application */
document
	.getElementById('language-switcher')
	.addEventListener('change', (event) => {
		const target = event.target
		const { value } = target
		updateState(map, 'core', 'language', value)
		target[0].innerHTML = value === 'en' ? 'English' : 'Englisch'
		target[1].innerHTML = value === 'en' ? 'German' : 'Deutsch'
	})

document
	.getElementById('color-scheme-switcher')
	.addEventListener('click', ({ target }) => {
		target.innerHTML = `Switch to ${colorScheme} mode`
		colorScheme = colorScheme === 'light' ? 'dark' : 'light'
		updateState(map, 'core', 'colorScheme', colorScheme)
	})
