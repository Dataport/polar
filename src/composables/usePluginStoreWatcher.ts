/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/core/composables/usePluginStoreWatcher
 */
/* eslint-enable tsdoc/syntax */

import { computed, watch, type ComputedRef, type WatchHandle } from 'vue'

import type { StoreReference } from '@/core/types'

import { useCoreStore } from '@/core/stores'
import { usePluginStore } from '@/core/stores/plugin'

/**
 * Configuration for a single store reference watcher.
 * @internal
 */
interface WatcherConfig {
	callback: (value: unknown) => void | Promise<void>
	handle: WatchHandle | null
	source: StoreReference
}

/**
 * Generic composable for watching multiple plugin store references.
 *
 * It watches the list of installed plugins to detect when target plugins
 * are added or removed, and manages the corresponding watchers accordingly.
 *
 * @param sources - Array of plugin store references to watch, or a computed reference to them, or a function returning them
 * @param callback - Function called when any watched plugin store value changes
 *
 * @example
 * ```typescript
 * const { setupPlugin, teardownPlugin } = usePluginStoreWatcher(
 *   () => configuration.value.coordinateSources || [],
 *   (coordinate) => {
 *     if (coordinate) {
 *       await reverseGeocode(coordinate)
 *     }
 *   }
 * )
 * ```
 *
 * @internal
 */
export function usePluginStoreWatcher(
	sources:
		| StoreReference[]
		| ComputedRef<StoreReference[]>
		| (() => StoreReference[]),
	callback: (value: unknown) => void | Promise<void>
) {
	const coreStore = useCoreStore()
	const pluginStore = usePluginStore()
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
	let pluginListWatcher: WatchHandle | null = null
	let sourcesWatcher: WatchHandle | null = null

	function setupWatcherForSource(watcherConfig: WatcherConfig) {
		if (watcherConfig.handle !== null) {
			return
		}

		if (!watcherConfig.source.plugin) {
			watcherConfig.handle = watch(
				() =>
					(coreStore as unknown as Record<string, unknown>)[
						watcherConfig.source.key
					],
				watcherConfig.callback
			)
			return
		}

		const store = coreStore.getPluginStore(watcherConfig.source.plugin)

		if (!store) {
			return
		}

		watcherConfig.handle = watch(
			() => store[watcherConfig.source.key],
			watcherConfig.callback
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
				!source.plugin || coreStore.getPluginStore(source.plugin) !== null

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
			() => pluginStore.plugins.map((p) => p.id),
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

	return {
		setupPlugin,
		teardownPlugin,
	}
}
