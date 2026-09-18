import { createMap } from '@/client'

void createMap('configuration-demo', 'services.json', {
	startCenter: [573575, 6018990],
	layers: [
		{
			id: '23420',
			name: 'basemap.de Web Raster Farbe',
			type: 'background',
			visibility: true,
		},
	],
	layout: 'nineRegions',
	scale: {},
})
