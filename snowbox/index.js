import { changeLanguage } from 'i18next'
import {
	addPlugin,
	createMap,
	removePlugin,
	subscribe,
} from '@polar/polar'
import styleJsonUrl from './style.json?url'

const basemapId = '23420'
const basemapGreyId = '23421'
const ausgleichsflaechen = '1454'
const reports = '6059'

// arbitrary condition for testing
const isEvenId = (mmlid) => Number(mmlid.slice(-1)) % 2 === 0

const isReportSelectable = (feature) =>
	feature
		.get('features')
		.reduce(
			(accumulator, current) => isEvenId(current.get('mmlid')) || accumulator,
			false
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
	},
	'https://geodienste.hamburg.de/services-internet.json',
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
	'dataport-map',
)

document.getElementById('secondMap').addEventListener('click', () => {
	const secondMap = document.createElement('dataport-map')
	secondMap.classList.add('snowbox')
	document.getElementById('secondMapContainer').appendChild(secondMap)
})
document.getElementById('secondMapClean').addEventListener('click', () => {
	document.getElementById('secondMapContainer').innerText = ''
})

// TODO: Update with proper plugins
setTimeout(
	() =>
		addPlugin({
			name: 'TEST',
			options: { displayComponent: true, layoutTag: 'MIDDLE_MIDDLE' },
		}),
	5000
)

setTimeout(() => removePlugin('TEST'), 10000)

subscribe(
	'markers/selectedCoordinates',
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
