import { register } from '../../../polar/core/src/index.ts'
await register()

const basemapId = '23420'
const basemapGreyId = '23421'

await document.getElementById('snowbox').init({
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
})
