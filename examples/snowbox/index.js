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
import pluginToast from '@polar/polar/plugins/toast'
import EmptyComponent from './EmptyComponent.vue'
import styleJsonUrl from './style.json?url'
import AnotherEmptyComponent from './AnotherEmptyComponent.vue'
import YetAnotherEmptyComponent from './YetAnotherEmptyComponent.vue'
import GeoLocationMock from './GeoLocationMock.ce.vue'

const basemapId = '23420'
const basemapGreyId = '23421'
const ausgleichsflaechen = '1454'
const reports = '6059'
const hamburgBorder = '1693' // boundary layer for pins / geolocalization

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
		layers: [
			{
				id: basemapId,
				visibility: true,
				type: 'background',
				name: 'snowbox.layers.basemap',
			},
			{
				id: basemapGreyId,
				type: 'background',
				name: 'snowbox.layers.basemapGrey',
			},
			{
				id: reports,
				type: 'mask',
				name: 'snowbox.layers.reports',
				visibility: true,
				styleId: 'panda',
			},
			{
				id: ausgleichsflaechen,
				type: 'mask',
				name: 'snowbox.layers.ausgleichsflaechen',
				styleId: 'panda',
				visibility: true,
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
	'https://geodienste.hamburg.de/services-internet.json'
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
	pluginIconMenu({
		displayComponent: true,
		layoutTag: 'TOP_RIGHT',
		initiallyOpen: 'kewl',
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
					plugin: {
						component: GeoLocationMock,
						id: 'geoLocationMock',
						locales: [],
					},
				},
			],
			[
				{
					plugin: {
						component: AnotherEmptyComponent,
						id: 'realKewl',
						locales: [],
					},
					icon: 'kern-icon--share',
				},
			],
			[
				{
					plugin: {
						component: EmptyComponent,
						id: 'kewl',
						locales: [],
					},
					icon: 'kern-icon-fill--layers',
				},
				{
					plugin: pluginFullscreen({}),
				},
			],
		],
	})
)
addPlugin(
	map,
	pluginGeoLocation({
		checkLocationInitially: false,
		keepCentered: false,
		renderType: 'independent',
		showTooltip: true,
		zoomLevel: 7,
		// usable when you're in HH or fake your geolocation to HH
		// boundaryLayerId: hamburgBorder,
		// boundaryOnError: 'strict',
		// toast: true,
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
