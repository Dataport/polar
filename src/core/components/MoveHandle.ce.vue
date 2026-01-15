<template>
	<div
		id="polar-move-handle"
		ref="handleElement"
		tabindex="0"
		@keydown.stop="moveHandle($event.key)"
		@mousedown.stop="onMouseDown"
		@touchstart.stop="onTouchStart"
	>
		<span class="kern-icon kern-icon--drag-handle" aria-hidden="true" />
		<div
			class="polar-move-handle-actions"
			:class="{ 'polar-move-handle-has-action-button': actionButton !== null }"
		>
			<component :is="actionButton" v-if="actionButton" />
			<button class="kern-btn kern-btn--tertiary" @click="close(true)">
				<span :class="`kern-icon ${closeIcon}`" aria-hidden="true" />
				<span class="kern-label kern-sr-only">
					{{ closeLabel }}
				</span>
			</button>
		</div>
		<component :is="component" />
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
	computed,
	onBeforeUnmount,
	onMounted,
	ref,
	useTemplateRef,
	watch,
} from 'vue'

import { useCoreStore } from '../stores'
import { useMoveHandleStore } from '../stores/moveHandle'

type MoveEventName = 'touchmove' | 'mousemove'
interface MoveEventNames {
	end: 'touchend' | 'mouseup'
	move: MoveEventName
}
type PolarMoveEvent = MouseEvent | TouchEvent

const minHeight = 0.1

let initialCursorY = 0
let preMoveHandleTop = 0
let resizeObserver: null | ResizeObserver = null
let touchDevice = false

const coreStore = useCoreStore()
const moveHandleStore = useMoveHandleStore()
const { deviceIsHorizontal } = storeToRefs(coreStore)
const { actionButton, closeLabel, closeIcon, component, top } =
	storeToRefs(moveHandleStore)

const handleElement = useTemplateRef<HTMLDivElement>('handleElement')

const isMoving = ref(false)
const maxHeight = ref(Number.MAX_SAFE_INTEGER)

const moveEventNames = computed<MoveEventNames>(() => {
	return touchDevice
		? { move: 'touchmove', end: 'touchend' }
		: { move: 'mousemove', end: 'mouseup' }
})

onMounted(() => {
	const { clientHeight } = (coreStore.shadowRoot as ShadowRoot).host
	if (top.value === null) {
		top.value = clientHeight * 0.55
	}
	const handle = handleElement.value as HTMLDivElement
	handle.style.position = 'fixed'
	handle.style.width = '100%'
	handle.style['z-index'] = 1
	handle.style.left = '0'
	handle.style.top = `${calculateTop(top.value, clientHeight, maxHeight.value)}px`
	resizeObserver = new ResizeObserver(updateMaxHeight)
	resizeObserver.observe(handle)
	handle.focus()
	updateMaxHeight()
})
onBeforeUnmount(() => {
	if (resizeObserver !== null) {
		resizeObserver.disconnect()
		resizeObserver = null
	}
	top.value = null
})

// Fixes an issue if the orientation of a mobile device is changed while a plugin is open
watch(deviceIsHorizontal, (newValue) => {
	if (!newValue) {
		updateMaxHeight()
	}
})
watch(isMoving, (newValue) => {
	const { move, end } = moveEventNames.value

	if (newValue) {
		;(handleElement.value as HTMLDivElement).classList.add(
			'polar-move-handle-is-moving'
		)
		document.addEventListener<MoveEventName>(move, onMove)
		document.addEventListener(end, onMoveEnd, { once: true })
		return
	}
	;(handleElement.value as HTMLDivElement).classList.remove(
		'polar-move-handle-is-moving'
	)
	document.removeEventListener<MoveEventName>(move, onMove)
	document.removeEventListener(end, onMoveEnd)
})
watch(maxHeight, (newValue, oldValue) => {
	// reset position if content shrank
	if (newValue < oldValue) {
		savePreMoveHandleTop()
		setNewPosition(0)
	}
})

function close(userInteraction: boolean) {
	moveHandleStore.closeFunction(userInteraction)
	moveHandleStore.$reset()
}

function calculateTop(
	topValue: number,
	containerHeight: number,
	maxHeight: number
) {
	let newTop = topValue

	if (containerHeight - newTop < containerHeight * minHeight) {
		newTop = containerHeight - containerHeight * minHeight
	}
	if (containerHeight - newTop > containerHeight * maxHeight) {
		newTop = containerHeight - containerHeight * maxHeight
	}
	top.value = newTop
	return newTop
}

function moveHandle(key: string) {
	if (key === 'ArrowUp' || key === 'ArrowDown') {
		savePreMoveHandleTop()
		setNewPosition(key === 'ArrowUp' ? -5 : 5)
	}
}

function onMouseDown(event: PolarMoveEvent) {
	touchDevice = false
	startMoving(event)
}

function onMove(event: PolarMoveEvent) {
	const clientX =
		event instanceof MouseEvent
			? event.clientX
			: (event.touches[0] as Touch).clientX
	const clientY =
		event instanceof MouseEvent
			? event.clientY
			: (event.touches[0] as Touch).clientY
	const deltaY = clientY - initialCursorY

	if (
		clientX < 0 ||
		clientX > window.innerWidth ||
		clientY < 0 ||
		clientY > window.innerHeight
	) {
		isMoving.value = false
	}
	setNewPosition(deltaY)
}

function onMoveEnd() {
	isMoving.value = false
}

function onTouchStart(event: PolarMoveEvent) {
	touchDevice = true
	startMoving(event)
}

function saveInitialCursorCoordinates(event: PolarMoveEvent) {
	initialCursorY =
		event instanceof MouseEvent
			? event.clientY
			: (event.touches[0] as Touch).clientY
}

function savePreMoveHandleTop() {
	preMoveHandleTop = (handleElement.value as HTMLDivElement).offsetTop
}

function setNewPosition(deltaY: number) {
	;(handleElement.value as HTMLDivElement).style.top = `${calculateTop(
		Math.round(preMoveHandleTop + deltaY),
		(coreStore.shadowRoot as ShadowRoot).host.clientHeight,
		maxHeight.value
	)}px`
}

function startMoving(event: PolarMoveEvent) {
	saveInitialCursorCoordinates(event)
	savePreMoveHandleTop()
	isMoving.value = true
}

function updateMaxHeight() {
	maxHeight.value =
		(handleElement.value as HTMLDivElement).clientHeight /
		(coreStore.shadowRoot as ShadowRoot).host.clientHeight
}
</script>

<style scoped>
#polar-move-handle {
	position: static;
	height: auto;
	width: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: var(--kern-color-layout-background-default);
	cursor: ns-resize;
	box-shadow:
		rgba(0, 0, 0, 0.3) 0 19px 38px,
		rgba(0, 0, 0, 0.22) 0 15px 12px;

	&:focus {
		outline: solid var(--kern-color-action-default);
	}
}

.polar-move-handle-actions {
	display: flex;
	justify-content: flex-end;
	width: 100%;
	padding: 0 var(--kern-metric-space-small);
}

.polar-move-handle-has-action-button {
	justify-content: space-between;
}

.polar-move-handle-is-moving {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none !important;
	user-select: none;
}

:deep(.kern-card) {
	box-shadow: none !important;
	width: 100%;
	border: none;
}
</style>
