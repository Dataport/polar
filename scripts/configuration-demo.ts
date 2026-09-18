// @ts-expect-error | Vite resolves the source alias for this browser-only entry
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
