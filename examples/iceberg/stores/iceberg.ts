import {
	fetchServiceRegister,
	type MapConfiguration,
	type MasterportalApiServiceRegister,
} from '@polar/polar'
import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'

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
			{
				id: '6059',
				visibility: true,
				type: 'mask',
				name: 'snowbox.layers.mml',
			},
		],
		startCenter: [573364, 6028874],
		layout: 'nineRegions',
		fullscreen: {
			displayComponent: true,
			layoutTag: 'TOP_RIGHT',
		},
		markers: {
			layers: [
				{
					id: '6059',
					defaultStyle: {
						stroke: '#FFFFFF',
						fill: '#005CA9',
					},
					hoverStyle: {
						stroke: '#46688E',
						fill: '#8BA1B8',
					},
					selectionStyle: {
						stroke: '#FFFFFF',
						fill: '#E10019',
					},
					unselectableStyle: {
						stroke: '#FFFFFF',
						fill: '#333333',
					},
				},
			],
			clusterClickZoom: true,
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
