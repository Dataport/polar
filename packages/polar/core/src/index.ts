import i18next from 'i18next'
import merge from 'lodash.merge'
import { storeToRefs } from 'pinia'
import { defineCustomElement, watch, type WatchOptions } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import type { MapConfiguration, PluginContainer, PluginOptions } from './types'
import { useCoreStore } from './stores/useCoreStore'
import defaults from './utils/defaults'
import '@kern-ux/native/dist/fonts/fira-sans.css'

export function addPlugins(plugins: PluginContainer[]) {
	plugins.forEach(addPlugin)
}

export function addPlugin(plugin: PluginContainer) {
	const { locales, name, options, storeModule } = plugin
	const coreStore = useCoreStore()

	const pluginConfiguration: PluginOptions = merge(
		{},
		options,
		coreStore.configuration[name] || {}
	)

	/* configuration merge – "options" are from client-code, "configuration"
	 * is from mapConfiguration object and thus overrides */
	coreStore.configuration = {
		...coreStore.configuration,
		[name]: pluginConfiguration,
	}

	const store = storeModule?.()
	if (store && typeof store.setupPlugin === 'function') {
		store.setupPlugin()
	}

	if (locales) {
		// NOTE: If somehow needed later, add the namespace to the Locale as well
		locales.forEach((lng) => {
			i18next.addResourceBundle(lng.type, 'common', lng.resources, true)
		})
	}

	coreStore.plugins = [...coreStore.plugins, plugin]
	if (pluginConfiguration.displayComponent && !pluginConfiguration.layoutTag) {
		console.warn(
			`@polar/core: Component "${name}" was registered as visible ('displayComponent' had a truthy value), but no 'layoutTag' was associated. This may be an error in configuration and will lead to the component not being visible in the UI.`
		)
	}
}

export function removePlugin(pluginName: string) {
	const coreStore = useCoreStore()
	const plugin = coreStore.plugins.find((p) => p.name === pluginName)

	if (!plugin) {
		console.error(`@polar/core:removePlugin: Plugin "${pluginName}" not found.`)
		return
	}
	const store = plugin.storeModule?.()
	if (store) {
		// TODO(dopenguin): Might need to be extended depending on the plugin
		store.$reset()
	}
	coreStore.plugins = coreStore.plugins.filter(
		(plugin) => plugin.name !== pluginName
	)
}

/**
 * Initialize map and setup all relevant functionality.
 * Registers the custom element for the polar map.
 *
 * @param mapConfiguration - Configuration options.
 * @param serviceRegister - Service register given through a URL or as an array.
 * @param tagName - Tag name for the custom element.
 */
export function createMap(
	mapConfiguration: MapConfiguration,
	serviceRegister: string | Record<string, unknown>[],
	tagName = 'polar-map'
) {
	// TODO(oeninghe-dataport): Split defineCustomElement to a separate function to allow two or more map clients per page

	const PolarMap = defineCustomElement(PolarMapCE, {
		configureApp(app) {
			app.use(I18Next, {
				initialLanguage: mapConfiguration.language,
				locales: mapConfiguration.locales,
			})
			app.use(Pinia)

			const coreStore = useCoreStore()

			coreStore.configuration = {
				...defaults,
				...mapConfiguration,
			}
			coreStore.serviceRegister = serviceRegister

			if (coreStore.configuration.oidcToken) {
				// copied to a separate spot for usage as it's changeable data at run-time
				coreStore.oidcToken = coreStore.configuration.oidcToken
			}
		},
	})

	customElements.define(tagName, PolarMap)
}

type SubscribeCallback = (value: unknown, oldValue: unknown) => void

export function subscribe(
	path: string,
	callback: SubscribeCallback,
	options?: WatchOptions
) {
	const steps = path.split('/')
	const isCore = steps.length === 1

	// const store = isCore ? useCoreStore() : getStore(steps[0])
	const parameterName = steps[isCore ? 0 : 1]

	return watch(storeToRefs(useCoreStore())[parameterName], callback, {
		immediate: true,
		...options,
	})
}

// TODO(dopenguin): Implement this once plugins are added so that the respective store is selected here.
// function getStore(storeName: string) {}
