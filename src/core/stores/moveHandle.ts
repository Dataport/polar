import { defineStore } from 'pinia'
import { type Component, markRaw, ref } from 'vue'
import type { MoveHandleProperties } from '../types'

export const useMoveHandleStore = defineStore('moveHandle', () => {
	const actionButton = ref<Component | null>(null)
	const closeFunction = ref<(userInteraction: boolean) => void>(() => {})
	const closeIcon = ref('kern-icon--close')
	const closeLabel = ref('')
	const component = ref<Component | null>(null)
	const isActive = ref(false)
	const plugin = ref('')

	function setMoveHandle(moveHandle: MoveHandleProperties | null) {
		if (moveHandle === null) {
			closeFunction.value(false)
			$reset()
			return
		}
		// Makes sure the previous plugin is properly closed if the "normal" way of closing isn't used.
		if (plugin.value !== moveHandle.plugin) {
			closeFunction.value(false)
		}
		isActive.value = true
		closeFunction.value = moveHandle.closeFunction
		closeLabel.value = moveHandle.closeLabel
		component.value = markRaw(moveHandle.component)
		plugin.value = moveHandle.plugin
		if (moveHandle.closeIcon) {
			closeIcon.value = moveHandle.closeIcon
		}
	}

	function setMoveHandleActionButton(component: Component | null) {
		actionButton.value = component === null ? null : markRaw(component)
	}

	function $reset() {
		actionButton.value = null
		closeFunction.value = () => {}
		closeIcon.value = 'kern-icon--close'
		closeLabel.value = ''
		component.value = null
		isActive.value = false
		plugin.value = ''
	}

	return {
		actionButton,
		closeFunction,
		closeIcon,
		closeLabel,
		component,
		isActive,
		plugin,
		$reset,
		/** @alpha */
		setMoveHandle,
		/** @alpha */
		setMoveHandleActionButton,
	}
})
