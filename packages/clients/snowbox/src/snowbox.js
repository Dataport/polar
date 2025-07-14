import { changeLanguage } from 'i18next'
import {
	addPlugin,
	createMap,
	removePlugin,
	subscribe,
} from '../../../polar/core/src/index.ts'

const basemapId = '23420'
const basemapGreyId = '23421'

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
		],
	},
	'https://geodienste.hamburg.de/services-internet.json'
)

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

// TODO: Update with plugin examples
subscribe(
	'clientWidth',
	(width) => (document.getElementById('client-width').innerText = width)
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
