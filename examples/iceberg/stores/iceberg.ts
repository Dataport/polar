import { ref, reactive } from 'vue'
import type { MapConfiguration } from '@polar/polar'
import { defineStore } from 'pinia'

export const useIcebergStore = defineStore('iceberg', () => {
	const mapConfiguration = reactive<MapConfiguration>({
		layers: [
			{
				id: '23420',
				visibility: true,
				type: 'background',
				name: 'snowbox.layers.basemap',
			},
		],
		startCenter: [0, 0],
		layout: 'nineRegions',
		fullscreen: {
			displayComponent: true,
			layoutTag: 'TOP_RIGHT',
		},
	})

	const serviceRegister = ref(
		'https://geodienste.hamburg.de/services-internet.json'
	)

	return {
		mapConfiguration,
		serviceRegister,
	}
})
