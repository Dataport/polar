import {
	addPlugin,
	createMap,
	createMapElement,
	getStore,
	subscribe,
	updateState,
} from '@polar/polar'
import pluginFullscreen from '@polar/polar/plugins/fullscreen'
import pluginGeoLocation from '@polar/polar/plugins/geoLocation'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginLayerChooser from '@polar/polar/plugins/layerChooser'
import pluginLoadingIndicator from '@polar/polar/plugins/loadingIndicator'
import pluginToast from '@polar/polar/plugins/toast'
import EmptyComponent from './EmptyComponent.vue'
import styleJsonUrl from './style.json?url'
import services from './services.js'
import YetAnotherEmptyComponent from './YetAnotherEmptyComponent.vue'

const basemapId = '23420'
const basemapGreyId = '23421'
const ausgleichsflaechen = '1454'
const reports = '6059'
const denkmal = 'denkmaelerWMS'
// const hamburgBorder = '1693' // boundary layer for pins / geolocalization

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
	},
}

// TODO: Re-enable with isSelectable
/*
// arbitrary condition for testing
const isEvenId = (mmlid) => Number(mmlid.slice(-1)) % 2 === 0

const isReportSelectable = (feature) =>
	feature
		.get('features')
		.reduce(
			(accumulator, current) => isEvenId(current.get('mmlid')) || accumulator,
			false
		)
*/

const map = await createMap(
	'snowbox',
	{
		colorScheme,
		startCenter: [573364, 6028874],
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
					// TODO(dopenguin): Has some HMR issues, needs to be fixed
					// isSelectable: isReportSelectable,
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
	},
	services
)

document.getElementById('secondMap').addEventListener('click', async () => {
	const secondMap = await createMapElement(
		{
			layers: [
				{
					id: basemapId,
					visibility: true,
					type: 'background',
					name: 'snowbox.layers.basemap',
				},
			],
		},
		'https://geodienste.hamburg.de/services-internet.json'
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
addPlugin(
	map,
	pluginLoadingIndicator({
		loaderStyle: 'BasicLoader',
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
					plugin: pluginGeoLocation({
						checkLocationInitially: false,
						keepCentered: false,
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
					plugin: pluginLayerChooser({}),
				},
				{
					plugin: pluginFullscreen({}),
				},
			],
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
