<template>
	<div ref="polar-wrapper" class="polar-wrapper" :lang="language">
		<PolarMap />
		<PolarUI />
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
} from 'vue'
import i18next from 'i18next'
import { useMainStore } from '../stores/main'
import { loadKern } from '../utils/loadKern'
import PolarMap from './PolarMap.ce.vue'
import PolarUI from './PolarUI.ce.vue'

defineOptions({
	inheritAttrs: false,
})

const mainStore = useMainStore()
const { language } = storeToRefs(mainStore)

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
mainStore.language = i18next.language
i18next.on('languageChanged', (newLanguage) => {
	mainStore.language = newLanguage
})

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
})

onBeforeUnmount(() => {
	if (resizeObserver instanceof ResizeObserver) {
		resizeObserver.unobserve(polarWrapper.value as Element)
		resizeObserver = null
	}

	mainStore.teardown()
})
</script>

<style>
:host {
	--brand-color-l: v-bind('mainStore.configuration.theme?.brandColor?.l');
	--brand-color-c: v-bind('mainStore.configuration.theme?.brandColor?.c');
	--brand-color-h: v-bind('mainStore.configuration.theme?.brandColor?.h');
}
</style>

<style scoped>
.polar-wrapper {
	position: absolute;
	height: inherit;
	width: inherit;
}
</style>
