import { register as registerKoliBri } from '@public-ui/components'
import { defineCustomElements } from '@public-ui/components/dist/loader'
import { ECL_EU } from '@public-ui/themes'

await registerKoliBri(ECL_EU, defineCustomElements, {
	environment: 'development',
}).then(() => {
	console.log('KoliBri loaded :)')
})

import { register } from '@polar/polar'

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
