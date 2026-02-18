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

import { addPlugins, getStore, subscribe } from '@polar/polar'
import pluginFullscreen from '@polar/polar/plugins/fullscreen'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginScale from '@polar/polar/plugins/scale'
import pluginToast from '@polar/polar/plugins/toast'
import { ref, useTemplateRef, watch } from 'vue'

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
						plugin: pluginFullscreen({ renderType: 'iconMenu' }),
					},
				],
			],
		}),
		pluginScale({
			displayComponent: true,
			layoutTag: 'BOTTOM_RIGHT',
			showScaleSwitcher: false,
		}),
		pluginToast({
			displayComponent: true,
			layoutTag: 'BOTTOM_MIDDLE',
		}),
	])

	subscribe(map, 'core', 'language', (newLanguage) => {
		language.value = newLanguage as string
	})
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
