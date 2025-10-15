import { acceptHMRUpdate, defineStore } from 'pinia'
import { markRaw, reactive } from 'vue'
import { toMerged } from 'es-toolkit'
import i18next from 'i18next'
import type {
	PluginContainer,
	PluginId,
	BundledPluginId,
	BundledPluginStores,
	PolarPluginStore,
	PluginOptions,
} from '../types'
import { useMainStore } from './main'

export const usePluginStore = defineStore('plugin', () => {
	const plugins = reactive<PluginContainer[]>([])
	const mainStore = useMainStore()

	function addPlugin(plugin: PluginContainer) {
		const { id, locales, options, storeModule } = plugin

		/* configuration merge – "options" are from client-code, "configuration"
		 * is from mapConfiguration object and thus overrides */
		const pluginConfiguration = toMerged(
			options || {},
			(mainStore.configuration[id] || {}) as PluginOptions
		)
		mainStore.configuration[id] = pluginConfiguration

		const store = storeModule?.(mainStore._instance)
		if (store && typeof store.setupPlugin === 'function') {
			store.setupPlugin()
		}

		if (locales) {
			locales.forEach((lng) => {
				i18next.addResourceBundle(lng.type, id, lng.resources, true)
			})
		}

		plugins.push({
			...plugin,
			// This is added for consistency. However, the options should be accessed via configuration.
			options: pluginConfiguration,
			...(plugin.component ? { component: markRaw(plugin.component) } : {}),
		})
	}

	function removePlugin(pluginId: string) {
		const pluginIndex = plugins.findIndex(({ id }) => id === pluginId)
		const plugin = plugins[pluginIndex]
		if (!plugin) {
			console.error(`Plugin "${pluginId}" not found.`)
			return
		}

		const store = plugin.storeModule?.(mainStore._instance)
		if (store) {
			if (typeof store.teardownPlugin === 'function') {
				store.teardownPlugin()
			}
			store.$reset()
		}

		plugins.splice(pluginIndex, 1)
	}

	function getPluginStore<T extends PluginId>(
		id: T
	): ReturnType<
		T extends BundledPluginId
			? BundledPluginStores<typeof id>
			: PolarPluginStore
	> | null {
		const plugin = plugins.find((plugin) => plugin.id === id)
		// @ts-expect-error | We trust that our internal IDs work.
		return plugin?.storeModule?.(mainStore._instance) || null
	}

	return {
		plugins,
		addPlugin,
		removePlugin,
		getPluginStore,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(usePluginStore, import.meta.hot))
}
