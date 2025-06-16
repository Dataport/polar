import { register } from '@/core'
register()

const basemapId = '23420'
const basemapGreyId = '23421'

document.getElementById('snowbox').init({
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
