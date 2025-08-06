<template>
	<div ref="polar-wrapper" class="polar-wrapper" :lang="language">
		<transition name="fade">
			<div
				v-if="!hasWindowSize && (noControlOnZoom || oneFingerPan)"
				class="polar-map-overlay"
			>
				<template v-if="noControlOnZoom">
					{{ $t(overlayLocale) }}
				</template>
				<template v-else-if="oneFingerPan">
					{{ $t('overlay.oneFingerPan') }}
				</template>
			</div>
		</transition>
		<div
			ref="polar-map-container"
			class="polar-map"
			tabindex="0"
			role="region"
			:aria-label="$t('canvas.label')"
		/>
		<PolarUi />
		<kern-button variant="primary" @click="demo">
			{{ $t('canvas.label') }}
		</kern-button>
	</div>
</template>

<script setup lang="ts">
import api from '@masterportal/masterportalapi/src/maps/api'
import { rawLayerList } from '@masterportal/masterportalapi'
import Hammer from 'hammerjs'
import { defaults } from 'ol/interaction'
import { storeToRefs } from 'pinia'
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	useTemplateRef,
	watch,
} from 'vue'
import { useCoreStore } from '../stores/core'
import { loadKern } from '../utils/loadKern'
import { useMarkerStore } from '../stores/marker'
import PolarUi from './PolarUI.ce.vue'

defineOptions({
	inheritAttrs: false,
})

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1
const coreStore = useCoreStore()

const noControlOnZoom = ref(false)
const oneFingerPan = ref(false)

const { hasWindowSize, language } = storeToRefs(coreStore)

const overlayLocale = computed(() => {
	return `overlay.${isMacOS ? 'noCommandOnZoom' : 'noControlOnZoom'}`
})

const polarMapContainer = useTemplateRef<HTMLDivElement>('polar-map-container')
const polarWrapper = useTemplateRef<HTMLDivElement>('polar-wrapper')

let resizeObserver: ResizeObserver | null = null

function createMap() {
	const map = api.map.createMap(
		{
			target: polarMapContainer.value,
			...coreStore.configuration,
			layerConf: coreStore.serviceRegister,
		},
		'2D',
		{
			mapParams: {
				interactions: defaults({
					altShiftDragRotate: false,
					pinchRotate: false,
					dragPan: false,
					mouseWheelZoom: false,
				}),
			},
		}
	)
	coreStore.setMap(map)
	coreStore.updateDragAndZoomInteractions()
	coreStore.updateSizeOnReady()
	updateListeners()
}

function updateClientDimensions() {
	coreStore.clientHeight = (polarWrapper.value as Element).clientHeight
	coreStore.clientWidth = (polarWrapper.value as Element).clientWidth
}

function updateListeners() {
	if (!hasWindowSize.value && polarMapContainer.value) {
		polarMapContainer.value.addEventListener('wheel', wheelEffect)

		if (coreStore.hasSmallDisplay) {
			new Hammer(polarMapContainer.value).on('pan', (e) => {
				if (
					e.maxPointers === 1 &&
					coreStore
						.getMap()
						.getInteractions()
						.getArray()
						.some((interaction) =>
							interaction.get('_isPolarDragLikeInteraction')
						)
				) {
					oneFingerPan.value = true
					setTimeout(() => (oneFingerPan.value = false), 2000)
				}
			})
		}
	}
}

let noControlOnZoomTimeout: ReturnType<typeof setTimeout>

function wheelEffect(event: WheelEvent) {
	clearTimeout(noControlOnZoomTimeout)
	noControlOnZoom.value = isMacOS ? !event.metaKey : !event.ctrlKey
	noControlOnZoomTimeout = setTimeout(
		() => (noControlOnZoom.value = false),
		2000
	)
}

async function setup() {
	if (coreStore.configuration.secureServiceUrlRegex) {
		coreStore.addInterceptor(coreStore.configuration.secureServiceUrlRegex)
	}
	createMap()
	if (coreStore.configuration.checkServiceAvailability) {
		coreStore.checkServiceAvailability()
	}
	if (coreStore.configuration.markers) {
		useMarkerStore().setupMarkers(coreStore.configuration.markers)
	}
	await coreStore.setupStyling()
	resizeObserver = new ResizeObserver(updateClientDimensions)
	resizeObserver.observe(polarWrapper.value as Element)
	updateClientDimensions()
	addEventListener('resize', coreStore.updateHasSmallDisplay)
	coreStore.updateHasSmallDisplay()
}

onMounted(async () => {
	await loadKern(
		polarWrapper.value?.parentNode as ShadowRoot,
		coreStore.configuration.theme?.kern || {}
	)
	if (Array.isArray(coreStore.serviceRegister)) {
		return setup()
	}
	rawLayerList.initializeLayerList(
		coreStore.serviceRegister,
		(layerConf: string | Record<string, unknown>[]) => {
			coreStore.serviceRegister = layerConf
			return setup()
		}
	)
})

onBeforeUnmount(() => {
	if (resizeObserver instanceof ResizeObserver) {
		resizeObserver.unobserve(polarWrapper.value as Element)
		resizeObserver = null
	}
	if (!hasWindowSize.value && polarMapContainer.value) {
		polarMapContainer.value.removeEventListener('wheel', wheelEffect)
	}
	removeEventListener('resize', coreStore.updateHasSmallDisplay)
})

watch(hasWindowSize, updateListeners)

function demo() {
	// eslint-disable-next-line no-console
	console.log('Button clicked')
}
</script>

<style scoped lang="scss">
@import url('ol/ol.css');

.polar-wrapper {
	--brand-color-l: v-bind('coreStore.configuration.theme?.brandColor?.l');
	--brand-color-c: v-bind('coreStore.configuration.theme?.brandColor?.c');
	--brand-color-h: v-bind('coreStore.configuration.theme?.brandColor?.h');

	position: absolute;
	height: inherit;
	width: inherit;

	.polar-map {
		width: 100%;
		height: 100%;
	}

	.polar-map-overlay {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: inherit;
		height: inherit;
		z-index: 42;
		font-size: 22px;
		text-align: center;
		color: white;
		background-color: rgba(0, 0, 0, 0.45);
		pointer-events: none;
	}
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
}
</style>
