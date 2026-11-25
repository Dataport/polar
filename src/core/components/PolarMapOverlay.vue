<template>
	<div class="kern-sr-only" role="status" aria-atomic="true">
		{{ message }}
	</div>
	<transition name="fade">
		<div v-if="message" class="polar-map-overlay" aria-hidden="true">
			{{ message }}
		</div>
	</transition>
</template>

<script setup lang="ts">
import type { Ref, WatchHandle } from 'vue'

import { onBeforeUnmount, ref, watch } from 'vue'

const message = ref('')
const messageWatcher = ref<WatchHandle | null>(null)
const conditionWatcher = ref<WatchHandle | null>(null)
const hideMessageTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

function resetWatchersAndClearHideTimeout() {
	if (messageWatcher.value) {
		messageWatcher.value()
		messageWatcher.value = null
	}
	if (conditionWatcher.value) {
		conditionWatcher.value()
		conditionWatcher.value = null
	}
	if (hideMessageTimeout.value) {
		clearTimeout(hideMessageTimeout.value)
		hideMessageTimeout.value = null
	}
}

function hide() {
	resetWatchersAndClearHideTimeout()
	message.value = ''
}

/**
 * Debounced display activation, i.e. each call will reset hide call timeout by displayTime, unless it is 0, in which case hide has to be called by controlling component.
 * @param messageText Message to show on overlay.
 * @param condition Condition that, if it becomes false, immediately hides the overlay.
 * @param displayTime Display time of message in ms.
 */
function show(
	messageText: Ref<string>,
	condition: Ref<boolean> | null = null,
	displayTime: number = 2000
) {
	resetWatchersAndClearHideTimeout()

	messageWatcher.value = watch(
		messageText,
		(value) => {
			message.value = value
		},
		// only override immediately if not the same as before (prevents screen readers from repeating endlessly)
		{ immediate: messageText.value !== message.value }
	)

	if (condition) {
		conditionWatcher.value = watch(
			condition,
			(value) => {
				if (!value) {
					hide()
				}
			},
			{ immediate: true }
		)
	}

	if (displayTime > 0) {
		hideMessageTimeout.value = setTimeout(hide, displayTime)
	}
}

onBeforeUnmount(resetWatchersAndClearHideTimeout)

defineExpose({
	show,
	hide,
})
</script>

<style scoped>
.polar-map-overlay {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	z-index: 42;
	font-size: var(--kern-typography-font-size-large-static);
	text-align: center;
	color: white;
	background-color: rgba(0, 0, 0, 0.45);
	pointer-events: none;
	border-radius: var(--kern-metric-border-radius-large);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
