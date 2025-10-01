<template>
	<div ref="polar-wrapper" class="polar-wrapper" :lang="language">
		<PolarMap :key="JSON.stringify(mainStore.configuration)" />
		<PolarUI :key="JSON.stringify(mainStore.configuration)" />
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
	onBeforeUnmount,
	onMounted,
	useHost,
	useShadowRoot,
	useTemplateRef,
	watch,
} from 'vue'
import i18next from 'i18next'
import { useMainStore } from '../stores/main'
import { loadKern } from '../utils/loadKern'
import { mapZoomOffset } from '../utils/mapZoomOffset'
import defaults from '../utils/defaults'
import type { MapConfiguration } from '../types'
import { useCoreStore } from '../stores/export'
import PolarUI from './PolarUI.ce.vue'
import PolarMap from './PolarMap.ce.vue'

defineOptions({
	inheritAttrs: false,
})

const props = defineProps<{
	mapConfiguration: MapConfiguration
	serviceRegister: Record<string, unknown>[]
}>()

defineExpose<{
	store: ReturnType<typeof useCoreStore>
}>()

const mainStore = useMainStore()
const { language } = storeToRefs(mainStore)

// TODO: Allow live-updates of configuration, if possible

watch(
	() => props.mapConfiguration,
	(mapConfiguration) => {
		mainStore.configuration = mapZoomOffset({
			...defaults,
			...mapConfiguration,
		})

		if (mainStore.configuration.oidcToken) {
			// copied to a separate spot for usage as it's changeable data at run-time
			mainStore.oidcToken = mainStore.configuration.oidcToken
		}

		if (mainStore.configuration.locales) {
			mainStore.configuration.locales.forEach((locale) => {
				Object.entries(locale.resources).forEach(([ns, resources]) => {
					i18next.addResourceBundle(locale.type, ns, resources, true, true)
				})
			})
		}
		if (mainStore.configuration.language) {
			i18next
				.changeLanguage(mainStore.configuration.language)
				.catch((error: unknown) => {
					console.error('Failed to set initial language:', error)
				})
		}
	},
	{ immediate: true, deep: true }
)

watch(
	() => props.serviceRegister,
	(serviceRegister) => {
		mainStore.serviceRegister = serviceRegister
	},
	{ immediate: true, deep: true }
)

mainStore.language = i18next.language
i18next.on('languageChanged', (newLanguage) => {
	mainStore.language = newLanguage
})
watch(
	() => mainStore.language,
	async (newLanguage) => {
		if (i18next.language === newLanguage) {
			return
		}
		await i18next.changeLanguage(newLanguage)
	}
)

const polarWrapper = useTemplateRef<HTMLDivElement>('polar-wrapper')

let resizeObserver: ResizeObserver | null = null

function updateClientDimensions() {
	mainStore.clientHeight = (polarWrapper.value as Element).clientHeight
	mainStore.clientWidth = (polarWrapper.value as Element).clientWidth
}

onMounted(() => {
	mainStore.lightElement = useHost()
	mainStore.shadowRoot = useShadowRoot()

	loadKern(
		mainStore.shadowRoot as ShadowRoot,
		mainStore.configuration.theme?.kern || {}
	)

	mainStore.setup()

	resizeObserver = new ResizeObserver(updateClientDimensions)
	resizeObserver.observe(polarWrapper.value as Element)
	updateClientDimensions()

	// FIXME: Improve types for lightElement
	;(mainStore.lightElement as { store?: unknown }).store = useCoreStore()
})

onBeforeUnmount(() => {
	if (resizeObserver instanceof ResizeObserver) {
		resizeObserver.unobserve(polarWrapper.value as Element)
		resizeObserver = null
	}

	mainStore.teardown()
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
:host {
	--brand-color-l: v-bind('mainStore.configuration.theme?.brandColor?.l');
	--brand-color-c: v-bind('mainStore.configuration.theme?.brandColor?.c');
	--brand-color-h: v-bind('mainStore.configuration.theme?.brandColor?.h');

	display: block;
}
</style>

<style scoped>
.polar-wrapper {
	position: absolute;
	height: inherit;
	width: inherit;
}
</style>
