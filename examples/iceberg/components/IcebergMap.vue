<template>
	<div :class="$style['action-bar']">
		<button class="kern-btn kern-btn--secondary" @click="switchLanguage">
			<span class="kern-icon kern-icon-fill--flag" />
			<span class="kern-label">{{
				language === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln'
			}}</span>
		</button>
		<button
			class="kern-btn kern-btn--secondary"
			@click="splitScreen = !splitScreen"
		>
			<span class="kern-icon kern-icon--splitscreen-left" />
			<span class="kern-label">{{
				splitScreen ? 'Exit split screen' : 'Enter split screen'
			}}</span>
		</button>
		<button class="kern-btn kern-btn--secondary" @click="darkMode = !darkMode">
			<span class="kern-icon kern-icon--dark-mode" />
			<span class="kern-label">{{
				darkMode ? 'Exit dark mode' : 'Enter dark mode'
			}}</span>
		</button>
		<button
			class="kern-btn kern-btn--secondary"
			@click="exportPluginActive = !exportPluginActive"
		>
			<span class="kern-icon kern-icon--photo-camera" />
			<span class="kern-label">{{
				exportPluginActive ? 'Deactivate export' : 'Activate export'
			}}</span>
		</button>
	</div>
	<polar-map
		v-if="store.serviceRegister.length"
		ref="map"
		:class="{ [$style['split-screen']]: splitScreen }"
		:map-configuration="store.mapConfiguration"
		:service-register="store.serviceRegister"
	/>
</template>

<script setup lang="ts">
import type { PolarContainer } from '@polar/polar'

import { addPlugins, getStore, removePlugin, subscribe } from '@polar/polar'
import pluginAddressSearch from '@polar/polar/plugins/addressSearch'
import pluginAttributions from '@polar/polar/plugins/attributions'
import pluginExport from '@polar/polar/plugins/export'
import pluginFilter from '@polar/polar/plugins/filter'
import pluginFullscreen from '@polar/polar/plugins/fullscreen'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginLayerChooser from '@polar/polar/plugins/layerChooser'
import pluginPins from '@polar/polar/plugins/pins'
import pluginPointerPosition from '@polar/polar/plugins/pointerPosition'
import pluginReverseGeocoder from '@polar/polar/plugins/reverseGeocoder'
import pluginScale from '@polar/polar/plugins/scale'
import pluginToast from '@polar/polar/plugins/toast'
import { computed, ref, useTemplateRef, watch } from 'vue'

import { useIcebergStore } from '../stores/iceberg'

const store = useIcebergStore()

const language = ref('de')
const splitScreen = ref(false)

const map = useTemplateRef<typeof PolarContainer>('map')
watch(map, (map) => {
	if (!map) {
		return
	}
	addPlugins(map, [
		pluginIconMenu({
			displayComponent: true,
			layoutTag: 'TOP_RIGHT',
			menus: [
				[
					{
						plugin: pluginFilter({
							layers: {
								6059: {
									categories: [
										{
											targetProperty: 'statu',
											knownValues: [
												{
													key: 'todo',
													values: ['In Bearbeitung'],
													icon: 'kern-icon--assignment',
												},
												{
													key: 'done',
													values: ['abgeschlossen'],
													icon: 'kern-icon--check',
												},
											],
										},
									],
									time: {
										targetProperty: 'start',
										freeSelection: 'until',
										last: [7],
										pattern: 'YYYYMMDD',
									},
								},
							},
						}),
					},
				],
				[
					{
						plugin: pluginLayerChooser({}),
						icon: 'kern-icon-fill--layers',
					},
					{
						plugin: pluginFullscreen({ renderType: 'iconMenu' }),
					},
				],
			],
		}),
		pluginAttributions({ displayComponent: true, layoutTag: 'BOTTOM_RIGHT' }),
		pluginScale({
			displayComponent: true,
			layoutTag: 'BOTTOM_RIGHT',
			showScaleSwitcher: false,
		}),
		pluginAddressSearch({
			displayComponent: true,
			layoutTag: 'TOP_LEFT',
			searchMethods: [],
		}),
		pluginPins({
			coordinateSources: [{ plugin: 'addressSearch', key: 'chosenAddress' }],
			boundary: {
				layerId: '1693',
			},
			movable: 'drag',
			style: {
				fill: '#FF0019',
			},
			toZoomLevel: 7,
		}),
		pluginReverseGeocoder({
			url: 'https://geodienste.hamburg.de/HH_WPS',
			coordinateSources: [
				{
					plugin: 'pins',
					key: 'coordinate',
				},
			],
			addressTarget: {
				plugin: 'addressSearch',
				key: 'selectResult',
			},
			zoomTo: 7,
		}),
		pluginToast({
			displayComponent: true,
			layoutTag: 'BOTTOM_MIDDLE',
		}),
		pluginPointerPosition({
			displayComponent: true,
			layoutTag: 'BOTTOM_LEFT',
		}),
		pluginExport({
			displayComponent: true,
			layoutTag: 'MIDDLE_LEFT',
			download: true,
			formats: ['pdf', 'jpeg', 'png'],
		}),
	])

	subscribe(map, 'core', 'language', (newLanguage) => {
		language.value = newLanguage as string
	})
})

const darkMode = computed({
	get: () => {
		if (!map.value) {
			return
		}
		const coreStore = getStore(map.value, 'core')
		return coreStore.colorScheme === 'dark'
	},
	set: (value: boolean) => {
		if (!map.value) {
			return
		}
		const coreStore = getStore(map.value, 'core')
		coreStore.colorScheme = value ? 'dark' : 'light'
	},
})

const exportPluginActive = computed({
	get: () => {
		if (!map.value) {
			return
		}
		return Boolean(getStore(map.value, 'export'))
	},
	set: (value: boolean) => {
		if (!map.value) {
			return
		}
		if (value) {
			addPlugins(map.value, [
				pluginExport({
					displayComponent: true,
					layoutTag: 'MIDDLE_LEFT',
					download: true,
					formats: ['pdf', 'jpeg', 'png'],
				}),
			])
		} else {
			removePlugin(map.value, 'export')
		}
	},
})

function switchLanguage() {
	if (!map.value) {
		return
	}

	const coreStore = getStore(map.value, 'core')
	coreStore.language = language.value === 'de' ? 'en' : 'de'
}
</script>

<style scoped>
@import url('@polar/polar/polar.css');
</style>

<style module>
.action-bar {
	display: flex;
	gap: 1em;
	margin-bottom: 1em;
}

.split-screen {
	width: 50%;
}
</style>
