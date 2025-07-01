<template>
	<div ref="polar-wrapper" class="polar-wrapper">
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
		<KolButton :_label="$t('canvas.label')" @click="demo" />
	</div>
</template>

<script setup lang="ts">
import api from '@masterportal/masterportalapi/src/maps/api'
import { rawLayerList } from '@masterportal/masterportalapi'
import { KolButton } from '@public-ui/vue'
import Hammer from 'hammerjs'
import { defaults } from 'ol/interaction'
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	toRef,
	useTemplateRef,
	watch,
} from 'vue'
import { useCoreStore } from '../store/useCoreStore'
import { mapZoomOffset } from '../utils/mapZoomOffset'
import { type MasterportalApiConfiguration } from '../types'

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1
const coreStore = useCoreStore()

const noControlOnZoom = ref(false)
const oneFingerPan = ref(false)

const hasWindowSize = toRef(coreStore.hasWindowSize)

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
			...mapZoomOffset(coreStore.configuration),
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
					coreStore.map
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

let noControlOnZoomTimeout: number

function wheelEffect(event: WheelEvent) {
	clearTimeout(noControlOnZoomTimeout)
	noControlOnZoom.value = isMacOS ? !event.metaKey : !event.ctrlKey
	noControlOnZoomTimeout = setTimeout(
		() => (noControlOnZoom.value = false),
		2000
	)
}

function setup() {
	createMap()
	resizeObserver = new ResizeObserver(updateClientDimensions)
	resizeObserver.observe(polarWrapper.value as Element)
	updateClientDimensions()
	addEventListener('resize', coreStore.updateHasSmallDisplay)
	coreStore.updateHasSmallDisplay()
}

onMounted(() => {
	if (Array.isArray(coreStore.serviceRegister)) {
		setup()
		return
	}
	rawLayerList.initializeLayerList(
		coreStore.serviceRegister,
		(layerConf: MasterportalApiConfiguration['layerConf']) => {
			coreStore.serviceRegister = layerConf
			setup()
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
	console.log('Button clicked')
}
</script>

<style lang="scss">
/* TODO(dopenguin): This should be something that is done by the embedding client. */
:host {
	display: block;
	width: 100%;
	height: 20em;
	margin: 1em 0;
}
</style>

<style scoped lang="scss">
.polar-wrapper {
	height: 100%;
	width: 100%;

	.polar-map {
		width: 100%;
		height: 100%;
	}

	.polar-map-overlay {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		/* TODO(dopenguin): Currently too large, spanning more than the map div */
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
