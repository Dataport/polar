import { register as registerKoliBri } from '@public-ui/components'
import { defineCustomElements } from '@public-ui/components/dist/loader'
import { ECL_EU } from '@public-ui/themes'

import { createMap } from '@polar/polar'

await registerKoliBri(ECL_EU, defineCustomElements, {
	environment: 'development',
}).then(() => {
	console.log('KoliBri loaded :)')
})

const basemapId = '23420'
const basemapGreyId = '23421'

await createMap('', {
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
