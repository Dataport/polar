import { changeLanguage } from 'i18next'
import { addPlugin, createMap, subscribe } from '@polar/polar'

import pluginFullscreen from '@polar/polar/plugins/fullscreen'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginLayerChooser from '@polar/polar/plugins/layerChooser'
import pluginLoadingIndicator from '@polar/polar/plugins/loadingIndicator'
import { useLoadingIndicatorStore } from '@polar/polar/plugins/loadingIndicator/store'
import pluginToast from '@polar/polar/plugins/toast'
import { useToastStore } from '@polar/polar/plugins/toast/store'

import EmptyComponent from './EmptyComponent.vue'
import styleJsonUrl from './style.json?url'
import services from './services.js'

const basemapId = '23420'
const basemapGreyId = '23421'
const ausgleichsflaechen = '1454'
const reports = '6059'
const denkmal = 'denkmaelerWMS'

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

await createMap(
	{
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
				},
			},
		],
	},
	services
)

await createMap(
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
	'https://geodienste.hamburg.de/services-internet.json',
	'dataport-map'
)

document.getElementById('secondMap').addEventListener('click', () => {
	const secondMap = document.createElement('dataport-map')
	secondMap.classList.add('snowbox')
	document.getElementById('secondMapContainer').appendChild(secondMap)
})
document.getElementById('secondMapClean').addEventListener('click', () => {
	document.getElementById('secondMapContainer').innerText = ''
})

addPlugin(
	pluginLoadingIndicator({
		loaderStyle: 'BasicLoader',
	})
)
addPlugin(
	pluginIconMenu({
		displayComponent: true,
		layoutTag: 'TOP_RIGHT',
		initiallyOpen: 'layerChooser',
		menus: [
			// TODO: Delete this plugin including the component once another plugin is implemented
			{
				plugin: {
					component: EmptyComponent,
					id: 'kewl',
					locales: [],
				},
				icon: 'kern-icon--drag-handle',
				hint: 'Something layered',
			},
			{
				plugin: pluginLayerChooser({}),
				icon: 'kern-icon--layers',
			},
		],
	})
)
addPlugin(
	pluginToast({
		displayComponent: true,
		layoutTag: 'BOTTOM_MIDDLE',
	})
)
addPlugin(
	pluginFullscreen({
		displayComponent: true,
		layoutTag: 'TOP_RIGHT',
	})
)

const toastStore = useToastStore()
toastStore.addToast({
	text: 'Hallo Welt',
	severity: 'info',
})
toastStore.addToast({
	text: 'Achtung! Dies ist ein Toast!',
	severity: 'error',
})

const loadingIndicatorStore = useLoadingIndicatorStore()
loadingIndicatorStore.addLoadingKey('loadingTest')
setTimeout(() => loadingIndicatorStore.removeLoadingKey('loadingTest'), 2000)

subscribe(
	'markers',
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
		changeLanguage(value).then(() => {
			target[0].innerHTML = value === 'en' ? 'English' : 'Englisch'
			target[1].innerHTML = value === 'en' ? 'German' : 'Deutsch'
		})
	})
