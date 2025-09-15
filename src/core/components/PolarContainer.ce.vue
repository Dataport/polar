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
import { useMainStore } from '../stores/main'
import { useMoveHandleStore } from '../stores/moveHandle'
import { loadKern } from '../utils/loadKern'
import MoveHandle from './MoveHandle.ce.vue'
import PolarMap from './PolarMap.ce.vue'
import PolarUI from './PolarUI.ce.vue'

defineOptions({
	inheritAttrs: false,
})

const mainStore = useMainStore()
const { hasSmallWidth, hasWindowSize, language } = storeToRefs(mainStore)

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
}
</style>

<style scoped>
.polar-wrapper {
	position: absolute;
	height: inherit;
	width: inherit;
}
</style>
