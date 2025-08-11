/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/fullscreen/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { PluginId, type FullscreenPluginOptions } from '.'
import { useCoreStore } from '@/core/stores/export'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for fullscreen mode detection and enablement.
 */
/* eslint-enable tsdoc/syntax */
export const useFullscreenStore = defineStore('plugins/fullscreen', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as FullscreenPluginOptions
	)

	const targetContainer = computed(() => {
		if (typeof configuration.value.targetContainer === 'string') {
			return (
				document.getElementById(configuration.value.targetContainer) ||
				document.documentElement
			)
		}
		if (!configuration.value.targetContainer) {
			return coreStore.lightElement || document.documentElement
		}
		return configuration.value.targetContainer
	})

	const _fullscreenEnabled = ref(false)

	async function enableFullscreen() {
		// @ts-expect-error | WebKit is still needed for iOS Safari
		if (targetContainer.value.webkitRequestFullscreen) {
			// @ts-expect-error | WebKit is still needed for iOS Safari
			await targetContainer.value.webkitRequestFullscreen()
			updateFullscreenState()
			return
		}

		await targetContainer.value.requestFullscreen()
		updateFullscreenState()
	}

	async function disableFullscreen() {
		// @ts-expect-error | WebKit is still needed for iOS Safari
		if (document.webkitExitFullscreen) {
			// @ts-expect-error | WebKit is still needed for iOS Safari
			await document.webkitExitFullscreen()
			updateFullscreenState()
			return
		}

		await document.exitFullscreen()
		updateFullscreenState()
	}

	const fullscreenEnabled = computed({
		get: () => _fullscreenEnabled.value,
		set: (value) => {
			if (value === _fullscreenEnabled.value) return
			;(value ? enableFullscreen : disableFullscreen)().catch(() => {
				console.warn('Failed to toggle fullscreen mode')
			})
		},
	})

	function updateFullscreenState() {
		_fullscreenEnabled.value =
			// @ts-expect-error | WebKit is still needed for iOS Safari
			document.fullscreenElement || document.webkitFullscreenElement
	}

	function setupPlugin() {
		addEventListener('fullscreenchange', updateFullscreenState)
		addEventListener('webkitfullscreenchange', updateFullscreenState)
	}

	function teardownPlugin() {
		removeEventListener('fullscreenchange', updateFullscreenState)
		removeEventListener('webkitfullscreenchange', updateFullscreenState)
	}

	return {
		/**
		 * Reading this property describes if fullscreen mode is enabled or disabled.
		 * Writing this property enables or disables fullscreen mode, respectively.
		 *
		 * @defaultValue false
		 */
		fullscreenEnabled,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})
