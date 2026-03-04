import {
	type MapConfiguration,
	type MasterportalApiServiceRegister,
} from '@polar/polar'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

import type { MpapiParameters } from '@/lib/getFeatures/types'

import services from '../services'

export const useIcebergStore = defineStore('iceberg', () => {
	const mapConfiguration = reactive<MapConfiguration>({
		checkServiceAvailability: true,
		layers: [
			{
				id: '23420',
				visibility: true,
				type: 'background',
				name: 'Basemap.de (Farbe)',
			},
			{
				id: '23421',
				visibility: true,
				type: 'background',
				name: 'Basemap.de (Grau)',
			},
			{
				id: '1454',
				type: 'mask',
				name: 'Ausgleichsflächen',
				styleId: 'panda',
				visibility: true,
				minZoom: 5,
			},
			{
				id: '1693',
				visibility: true,
				hideInMenu: true,
				type: 'mask',
				name: 'Stadtgrenze Hamburg',
			},
			{
				id: 'denkmaelerWMS',
				type: 'mask',
				name: 'Kulturdenkmale',
				visibility: true,
				options: {
					layers: {
						order: '6,24,25,4,3,2,1,0',
						title: {
							/* eslint-disable @typescript-eslint/naming-convention */
							6: 'Denkmalbereich',
							24: 'Mehrheit von baulichen Anlagen',
							25: 'Sachgesamtheit',
							4: 'Baudenkmal',
							3: 'Gründenkmal',
							2: 'Gewässer',
							1: 'Baudenkmal (Fläche)',
							0: 'Gründenkmal (Fläche)',
							/* eslint-enable @typescript-eslint/naming-convention */
						},
						legend: true,
					},
				},
			},
			{
				id: '6059',
				visibility: true,
				type: 'mask',
				name: 'snowbox.layers.mml',
			},
		],
		startCenter: [565874, 5934140],
		layout: 'nineRegions',
		addressSearch: {
			searchMethods: [
				{
					queryParameters: {
						searchStreets: true,
						searchHouseNumbers: true,
					} as MpapiParameters,
					type: 'mpapi',
					url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
				},
			],
			minLength: 3,
			waitMs: 300,
			focusAfterSearch: true,
			groupProperties: {
				// @ts-expect-error | defaultGroup has a default label
				defaultGroup: {
					limitResults: 5,
				},
			},
		},
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
		pins: {
			coordinateSources: [{ plugin: 'addressSearch', key: 'chosenAddress' }],
			movable: 'drag',
			style: {
				fill: '#FF0019',
			},
			toZoomLevel: 7,
		},
	})

	const serviceRegister = ref<MasterportalApiServiceRegister>(services)

	return {
		mapConfiguration,
		serviceRegister,
	}
})
