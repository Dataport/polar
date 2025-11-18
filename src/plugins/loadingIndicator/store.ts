/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/loadingIndicator/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useCoreStore } from '@/core/stores/export.ts'
import type { LoaderStyles } from '@/plugins/loadingIndicator/types.ts'

const styles = [
	'CircleLoader',
	'BasicLoader',
	'RingLoader',
	'RollerLoader',
	'SpinnerLoader',
	'kern-loader',
]

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the loading indicator.
 */
/* eslint-enable tsdoc/syntax */
export const useLoadingIndicatorStore = defineStore(
	'plugins/loadingIndicator',
	() => {
		const loadKeys = ref(new Set<string>())
		const loaderStyle = ref<LoaderStyles | null>('kern-loader')
		const showLoader = computed(
			() => loadKeys.value.size > 0 && loaderStyle.value !== null
		)

		function setupPlugin() {
			const configuredStyle =
				useCoreStore().configuration.loadingIndicator?.loaderStyle
			if (configuredStyle) {
				setLoaderStyle(configuredStyle)
			}
		}
		function teardownPlugin() {
			setLoaderStyle('kern-loader')
		}

		function addLoadingKey(key: string) {
			loadKeys.value = new Set([...loadKeys.value, key])
		}

		function removeLoadingKey(key: string) {
			const newLoadKeys = new Set(loadKeys.value)
			newLoadKeys.delete(key)
			loadKeys.value = newLoadKeys
		}

		function setLoaderStyle(style: LoaderStyles) {
			if (styles.includes(style)) {
				loaderStyle.value = style
			} else {
				console.error(
					`Loader style ${style} does not exist. Using previous style (${loaderStyle.value}).`
				)
			}
		}

		return {
			/** The current loader style. */
			loaderStyle,

			/** Whether the loader should currently be shown. */
			showLoader,

			/**
			 * Adds a loading indicator with the given `key`.
			 *
			 * The `key` is a unique identifier used to keep track of the added loader
			 * via a Set. It can't be added multiple times, and removing it once always
			 * removes it altogether.
			 *
			 * The LoadingIndicator will usually be used for asynchronous code.
			 *
			 * @remarks
			 * It is advised to use a key like `{my-plugin-or-application-name}-{procedure-name}`
			 * to avoid name conflicts.
			 */
			addLoadingKey,

			/**
			 * Removes the loading indicator with the given `key`.
			 *
			 * @remarks
			 * This function **always has to be called in the `finally` section of your code**
			 * to prevent hanging loading indicators.
			 */
			removeLoadingKey,

			/** Change the loader style at runtime. */
			setLoaderStyle,

			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,
		}
	}
)
