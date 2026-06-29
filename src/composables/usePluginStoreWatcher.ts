/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/core/composables/usePluginStoreWatcher
 */
/* eslint-enable tsdoc/syntax */

import {
	computed,
	type ComputedRef,
	onScopeDispose,
	watch,
	type WatchOptions,
	type WatchStopHandle,
} from 'vue'

import type { WatcherStoreReference } from '@/core/types'

import { useCoreStore } from '@/core/stores'

/**
 * Configuration for a single store reference watcher.
 * @internal
 */
interface WatcherConfig {
	callback: (
		value: unknown,
		source: WatcherStoreReference
	) => void | Promise<void>
	handle: WatchStopHandle | null
	source: WatcherStoreReference
}

/**
 * Generic composable for watching multiple plugin store references.
 *
 * It watches the list of installed plugins to detect when target plugins
 * are added or removed, and manages the corresponding watchers accordingly.
 *
 * @param sources - Array of plugin store references to watch, or a computed reference to them, or a function returning them
 * @param callback - Function called when any watched plugin store value changes
 * @param watchOptions - Optional watch options to pass to the underlying Vue watcher (e.g., `{ immediate: true }`)
 *
 * @example
 * ```typescript
 * const { setupPlugin, teardownPlugin } = usePluginStoreWatcher(
 *   () => configuration.value.coordinateSources || [],
 *   (coordinate) => {
 *     if (coordinate) {
 *       await reverseGeocode(coordinate)
 *     }
 *   },
 *   { immediate: true }
 * )
 * ```
 *
 * @internal
 */
export function usePluginStoreWatcher(
	sources:
		| WatcherStoreReference[]
		| ComputedRef<WatcherStoreReference[]>
		| (() => WatcherStoreReference[]),
	callback: WatcherConfig['callback'],
	watchOptions?: WatchOptions
) {
	const coreStore = useCoreStore()
	const sourcesArray = computed(() => {
		if (typeof sources === 'function') {
			return sources()
		}
		if ('value' in sources) {
			return sources.value
		}
		return sources
	})

	const watchers: WatcherConfig[] = []
	let pluginListWatcher: WatchStopHandle | null = null
	let sourcesWatcher: WatchStopHandle | null = null

	function setupWatcherForSource(watcherConfig: WatcherConfig) {
		if (watcherConfig.handle !== null) {
			return
		}

		if (!watcherConfig.source.plugin) {
			return
		}

		const store = coreStore.getPluginStore(watcherConfig.source.plugin)

		if (!store) {
			console.warn(
				`"${watcherConfig.source.plugin}" not found. Cannot watch "${watcherConfig.source.key}".`
			)
			return
		}

		watcherConfig.handle = watch(
			() => store[watcherConfig.source.key],
			(value) => {
				const sourceKey = watcherConfig.source.key + 'Source'
				if (
					sourceKey in store &&
					typeof store[sourceKey] === 'string' &&
					((watcherConfig.source.ignoredSources ?? []) as string[]).includes(
						store[sourceKey]
					)
				) {
					return
				}
				return watcherConfig.callback(value, watcherConfig.source)
			},
			watchOptions
		)
	}

	function removeWatcherForSource(watcherConfig: WatcherConfig) {
		if (watcherConfig.handle) {
			watcherConfig.handle()
			watcherConfig.handle = null
		}
	}

	function updateWatchersBasedOnInstalledPlugins() {
		const currentSources = sourcesArray.value

		watchers.forEach((watcherConfig, index) => {
			if (!currentSources.some((s) => s === watcherConfig.source)) {
				removeWatcherForSource(watcherConfig)
				watchers.splice(index, 1)
			}
		})

		currentSources.forEach((source) => {
			let watcherConfig = watchers.find((w) => w.source === source)

			if (!watcherConfig) {
				watcherConfig = { source, callback, handle: null }
				watchers.push(watcherConfig)
			}

			const pluginIsInstalled =
				source.plugin && coreStore.getPluginStore(source.plugin)

			if (pluginIsInstalled && !watcherConfig.handle) {
				setupWatcherForSource(watcherConfig)
			} else if (!pluginIsInstalled && watcherConfig.handle) {
				removeWatcherForSource(watcherConfig)
			}
		})
	}

	function setupPlugin() {
		updateWatchersBasedOnInstalledPlugins()

		sourcesWatcher = watch(sourcesArray, () => {
			updateWatchersBasedOnInstalledPlugins()
		})

		pluginListWatcher = watch(
			() => coreStore.usedPlugins,
			() => {
				updateWatchersBasedOnInstalledPlugins()
			}
		)
	}

	function teardownPlugin() {
		watchers.forEach((watcher) => {
			removeWatcherForSource(watcher)
		})
		watchers.length = 0

		if (sourcesWatcher) {
			sourcesWatcher()
			sourcesWatcher = null
		}

		if (pluginListWatcher) {
			pluginListWatcher()
			pluginListWatcher = null
		}
	}

	setupPlugin()
	onScopeDispose(teardownPlugin)
}
