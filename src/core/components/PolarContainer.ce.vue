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
import { useMainStore } from '../stores/main'
import { loadKern } from '../utils/loadKern'
import PolarMap from './PolarMap.ce.vue'
import PolarUI from './PolarUI.ce.vue'

defineOptions({
	inheritAttrs: false,
})

const coreStore = useMainStore()

const { language } = storeToRefs(coreStore)

const polarWrapper = useTemplateRef<HTMLDivElement>('polar-wrapper')

let resizeObserver: ResizeObserver | null = null

function updateClientDimensions() {
	coreStore.clientHeight = (polarWrapper.value as Element).clientHeight
	coreStore.clientWidth = (polarWrapper.value as Element).clientWidth
}

function setup() {
	resizeObserver = new ResizeObserver(updateClientDimensions)
	resizeObserver.observe(polarWrapper.value as Element)
	updateClientDimensions()
	addEventListener('resize', coreStore.updateHasSmallDisplay)
	coreStore.updateHasSmallDisplay()
}

onMounted(() => {
	coreStore.lightElement = useHost()
	coreStore.shadowRoot = useShadowRoot()
	loadKern(
		coreStore.shadowRoot as ShadowRoot,
		coreStore.configuration.theme?.kern || {}
	)
	setup()
})

onBeforeUnmount(() => {
	if (resizeObserver instanceof ResizeObserver) {
		resizeObserver.unobserve(polarWrapper.value as Element)
		resizeObserver = null
	}
	removeEventListener('resize', coreStore.updateHasSmallDisplay)
})
</script>

<style>
:host {
	--brand-color-l: v-bind('coreStore.configuration.theme?.brandColor?.l');
	--brand-color-c: v-bind('coreStore.configuration.theme?.brandColor?.c');
	--brand-color-h: v-bind('coreStore.configuration.theme?.brandColor?.h');
}
</style>

<style scoped>
.polar-wrapper {
	position: absolute;
	height: inherit;
	width: inherit;
}
</style>
