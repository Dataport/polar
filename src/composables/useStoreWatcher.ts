/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/composables/useStoreWatcher
 */
/* eslint-enable tsdoc/syntax */

import type { ComputedRef, WatchOptions, WatchStopHandle } from 'vue'
import type { StoreReference } from '@/core/types'

import { computed, onScopeDispose, watch } from 'vue'

import { useCoreStore } from '@/core/stores'

/** @internal */
interface OriginEntry {
	chain: string[]

	/**
	 * The value the {@link chain} was recorded for.
	 * Used to invalidate stale entries: if a store field is overwritten
	 * directly (e.g. by a user interaction) the stored value no longer matches
	 * and the entry is ignored.
	 */
	value: unknown
}

/** @internal */
type StoreWatcherOptions = WatchOptions & {
	/**
	 * Store reference(s) the callback writes its result to.
	 * Used to break possible reference loops.
	 */
	target?: StoreReference | StoreReference[]
}

/**
 * Configuration for a single store reference watcher.
 * @internal
 */
interface WatcherConfig {
	callback: (value: unknown, source: StoreReference) => void | Promise<void>
	handle: WatchStopHandle | null
	source: StoreReference
}

const originRegistries = new WeakMap<object, Map<string, OriginEntry>>()

/**
 * Generic composable for watching multiple core or plugin store references.
 *
 * It watches the list of installed plugins to detect when target plugins
 * are added or removed, and manages the corresponding watchers accordingly.
 *
 * @param sources - Array of core or plugin store references to watch, or a computed reference to them, or a function returning them
 * @param callback - Function called when any watched core or plugin store value changes
 * @param options - Optional {@link WatchOptions} (e.g. `{ immediate: true }`) plus an optional {@link StoreWatcherOptions.target | target}
 *
 * @example
 * ```typescript
 * useStoreWatcher(
 *   () => configuration.value.coordinateSources || [],
 *   (value) => {
 *     if (value) {
 *       addPin(value)
 *     }
 *   },
 *   { target: { plugin: 'pins', key: 'coordinate' } }
 * )
 * ```
 *
 * @internal
 */
export function useStoreWatcher(
	sources:
		StoreReference[] | ComputedRef<StoreReference[]> | (() => StoreReference[]),
	callback: WatcherConfig['callback'],
	options?: StoreWatcherOptions
) {
	const coreStore = useCoreStore()
	const { target, ...watchOptions } = options ?? {}
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

	function resolveTargets() {
		const list = Array.isArray(target) ? target : target ? [target] : []
		return list.map((reference) => ({
			id: reference.plugin ?? 'core',
			key: reference.key,
			store: reference.plugin
				? coreStore.getPluginStore(reference.plugin)
				: coreStore,
		}))
	}

	function setupWatcherForSource(watcherConfig: WatcherConfig) {
		if (watcherConfig.handle !== null) {
			return
		}
		const { source } = watcherConfig
		const store = source.plugin
			? coreStore.getPluginStore(source.plugin)
			: coreStore

		if (!store) {
			console.warn(
				`"${source.plugin}" not found. Cannot watch "${source.key}".`
			)
			return
		}

		watcherConfig.handle = watch(
			() => store[source.key],
			async (value) => {
				const registry =
					originRegistries.get(coreStore) ?? new Map<string, OriginEntry>()
				originRegistries.set(coreStore, registry)

				const sourcePlugin = source.plugin ?? 'core'

				const entry = registry.get(`${sourcePlugin}/${source.key}`)

				const incoming =
					entry && Object.is(entry.value, value) ? entry.chain : []

				const targets = resolveTargets()
				// Do nothing if target is already part of the loop
				if (targets.some(({ id }) => incoming.includes(id))) {
					return
				}

				// Stamp the origin on the targets synchronously (before awaiting)
				// so downstream watchers observe it before they run and can break loops.
				const result = watcherConfig.callback(value, source)
				targets.forEach(({ id, key, store: targetStore }) => {
					if (targetStore) {
						registry.set(`${id}/${key}`, {
							chain: [...incoming, sourcePlugin],
							value: targetStore[key],
						})
					}
				})
				await result
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

			const targetIsInstalled =
				!source.plugin || coreStore.usedPlugins.includes(source.plugin)

			if (targetIsInstalled && !watcherConfig.handle) {
				setupWatcherForSource(watcherConfig)
			} else if (!targetIsInstalled && watcherConfig.handle) {
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

if (import.meta.vitest) {
	const { expect, test, vi, afterEach } = import.meta.vitest
	const { createPinia, setActivePinia } = await import('pinia')
	const { reactive, effectScope, nextTick } = await import('vue')
	const useCoreStoreFile = await import('@/core/stores')

	let activeScope: ReturnType<typeof effectScope> | null = null
	afterEach(() => {
		activeScope?.stop()
		activeScope = null
	})

	// Rebuilds the real AddressSearch -> Pins -> ReverseGeocoder -> AddressSearch wiring:
	// a chosen address moves the pin, which reverse geocodes and would write the
	// address selection back, closing the loop.
	const setup = (options: { withTarget: boolean }) => {
		setActivePinia(createPinia())

		const pins = reactive({ coordinate: null as [number, number] | null })
		const selectResult = vi.fn()
		const addressSearch = reactive({
			chosenAddress: null as [number, number] | null,
			selectResult,
		})
		const stores: Record<string, object> = { pins, addressSearch }
		const coreStore = reactive({
			usedPlugins: ['pins', 'addressSearch', 'reverseGeocoder'],
			getPluginStore: (plugin: string) => stores[plugin] ?? null,
		})
		vi.spyOn(useCoreStoreFile, 'useCoreStore').mockReturnValue(
			coreStore as ReturnType<typeof useCoreStore>
		)

		activeScope = effectScope()
		activeScope.run(() => {
			useStoreWatcher(
				[{ plugin: 'addressSearch', key: 'chosenAddress' }],
				(value) => {
					pins.coordinate = value as [number, number] | null
				},
				{ target: { plugin: 'pins', key: 'coordinate' } }
			)
			useStoreWatcher(
				[{ plugin: 'pins', key: 'coordinate' }],
				(value) => selectResult(value),
				options.withTarget
					? { target: { plugin: 'addressSearch', key: 'selectResult' } }
					: undefined
			)
		})

		// Chooses an address and lets the watcher chain settle.
		const selectAddress = async (coordinate: [number, number]) => {
			addressSearch.chosenAddress = coordinate
			await nextTick()
			await Promise.resolve()
		}

		return { pins, selectResult, selectAddress }
	}

	test('breaks the reference loop via target', async () => {
		const { pins, selectResult, selectAddress } = setup({ withTarget: true })

		await selectAddress([1, 2])

		expect(pins.coordinate).toEqual([1, 2])
		expect(selectResult).not.toHaveBeenCalled()
	})

	test('would loop without a target', async () => {
		const { selectResult, selectAddress } = setup({ withTarget: false })

		await selectAddress([1, 2])

		expect(selectResult).toHaveBeenCalledWith([1, 2])
	})
}
