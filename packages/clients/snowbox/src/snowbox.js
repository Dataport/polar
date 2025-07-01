import { createMap } from '../../../polar/core/src/index.ts'

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
