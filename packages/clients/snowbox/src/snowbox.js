import { register as registerKoliBri } from '@public-ui/components'
import { defineCustomElements } from '@public-ui/components/dist/loader'
import { ECL_EU } from '@public-ui/themes'
registerKoliBri(ECL_EU, defineCustomElements).then(() => {
	console.log('KoliBri loaded :)')
})

import { register } from '@polar/polar'
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
