<template>
	<div ref="polar-wrapper" class="polar-wrapper" :lang="language">
		<PolarMap />
		<PolarUI />
		<MoveHandle
			v-if="isActive && hasWindowSize && hasSmallWidth"
			:key="moveHandleKey"
		/>
	</div>
</template>

<script setup lang="ts">
import { toMerged } from 'es-toolkit'
import i18next from 'i18next'
import { storeToRefs } from 'pinia'
import {
	onBeforeUnmount,
	onMounted,
	ref,
	useHost,
	useShadowRoot,
	useTemplateRef,
	watch,
} from 'vue'
import { useCoreStore } from '../stores/export'
import { useMainStore } from '../stores/main'
import { useMoveHandleStore } from '../stores/moveHandle'
import type { MapConfiguration, MasterportalApiServiceRegister } from '../types'
import { loadKern } from '../utils/loadKern'
import { mapZoomOffset } from '../utils/mapZoomOffset'
import MoveHandle from './MoveHandle.ce.vue'
import PolarMap from './PolarMap.ce.vue'
import PolarUI from './PolarUI.ce.vue'

defineOptions({
	inheritAttrs: false,
})

const props = defineProps<{
	mapConfiguration: MapConfiguration
	serviceRegister: MasterportalApiServiceRegister
}>()

defineExpose<{
	store: ReturnType<typeof useCoreStore>
}>()

const mainStore = useMainStore()
const { hasSmallWidth, hasWindowSize, language } = storeToRefs(mainStore)

mainStore.configuration = toMerged(
	mainStore.configuration,
	mapZoomOffset(props.mapConfiguration)
)

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

mainStore.serviceRegister = props.serviceRegister

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

const { isActive } = storeToRefs(useMoveHandleStore())
const moveHandleKey = ref(0)
// Make sure the element is properly updated.
watch(isActive, () => (moveHandleKey.value += 1))

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
	// This is necessary for making `getStore` work
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
	--polar-shadow-color: 0deg 0% 63%;
	--polar-shadow:
		0 0.5px 0.5px hsl(var(--polar-shadow-color) / 0.43),
		0 1.5px 1.6px -1px hsl(var(--polar-shadow-color) / 0.4),
		0 4px 4.2px -2px hsl(var(--polar-shadow-color) / 0.36),
		-0.1px 10.1px 10.6px -3px hsl(var(--polar-shadow-color) / 0.32);
}

@layer polar-map {
	:host {
		display: block;
		width: 100%;
		height: 30em;
	}
}
</style>

<style scoped>
.polar-wrapper {
	position: relative;
	height: 100%;
	width: 100%;
}
</style>
