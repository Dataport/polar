import { ref, reactive, watch } from 'vue'
import {
	fetchServiceRegister,
	type MapConfiguration,
	type MasterportalApiServiceRegister,
} from '@polar/polar'
import { defineStore } from 'pinia'

export const useIcebergStore = defineStore('iceberg', () => {
	const mapConfiguration = reactive<MapConfiguration>({
		checkServiceAvailability: true,
		layers: [
			{
				id: '23420',
				visibility: true,
				type: 'background',
				name: 'snowbox.layers.basemap',
			},
		],
		startCenter: [573364, 6028874],
		layout: 'nineRegions',
		fullscreen: {
			displayComponent: true,
			layoutTag: 'TOP_RIGHT',
		},
	})

	const serviceRegisterUrl = ref(
		'https://geodienste.hamburg.de/services-internet.json'
	)

	const serviceRegister = ref<MasterportalApiServiceRegister>([])
	watch(
		serviceRegisterUrl,
		async (url) => {
			serviceRegister.value = await fetchServiceRegister(url)
		},
		{ immediate: true }
	)

	return {
		mapConfiguration,
		serviceRegister,
	}
})
