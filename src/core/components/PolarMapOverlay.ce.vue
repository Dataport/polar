<template>
	<transition name="fade">
		<div v-if="message" class="polar-map-overlay">
			{{ message }}
		</div>
	</transition>
</template>

<script setup lang="ts">
import { ref, type Ref, watch, type WatchHandle } from 'vue'

const message = ref('')
const conditionWatcher = ref<WatchHandle | null>(null)
const hideMessageTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

function hide() {
	message.value = ''
	if (conditionWatcher.value) {
		conditionWatcher.value()
	}
	if (hideMessageTimeout.value) {
		clearTimeout(hideMessageTimeout.value)
	}
}

function show(
	messageText: string,
	condition: Ref<boolean> | null = null,
	displayTime: number = 2000
) {
	message.value = messageText

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
</style>
