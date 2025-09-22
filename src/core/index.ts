/* eslint-disable tsdoc/syntax */
/**
 * This is the main export for the NPM package \@polar/polar.
 *
 * Lost? You probably want to start at {@link register} and {@link createMap}.
 *
 * @packageDocumentation
 * @module \@polar/polar
 */
/* eslint-enable tsdoc/syntax */

import '@kern-ux/native/dist/fonts/fira-sans.css'
import { storeToRefs } from 'pinia'
import { defineCustomElement, watch, type WatchOptions } from 'vue'
import PolarContainer from './components/PolarContainer.ce.vue'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import type { MapConfiguration, PluginContainer } from './types'
import { useMainStore } from './stores/main'
import { useMarkerStore } from './stores/marker'

import './monkeyHeaderLoader'

/**
 * Calls `addPlugin` for each plugin in the array.
 *
 * @param map - Map to add the plugin to.
 * @param plugins - Plugins to be added.
 */
export function addPlugins(
	map: typeof PolarContainer,
	plugins: PluginContainer[]
) {
	plugins.forEach((plugin) => {
		addPlugin(map, plugin)
	})
}

/**
 * Before instantiating the map, all required plugins have to be added. Depending on how you use POLAR, this may
 * already have been done. Ready-made clients (that is, packages prefixed `@polar/client-`) come with plugins prepared.
 *
 * You may add further plugins or proceed with `createMap`.
 *
 * Please note that the order of certain plugins is relevant when other plugins are referenced,
 * e.g. `@polar/plugin-gfi`'s `coordinateSources` requires the configured sources to have previously been set up.
 *
 * In case you're integrating new plugins, call `addPlugin` with a plugin instance.
 *
 * If you want to add multiple plugins at once, you can use `addPlugins` instead.
 *
 * @example
 * ```
 * addPlugin(Plugin(pluginOptions: PluginOptions))
 * ```
 *
 * @remarks
 * In case you're writing a new plugin, it must fulfill the following API:
 * ```
 * const Plugin = (options: PluginOptions): PluginContainer => ({
 * 	id,
 * 	component,
 * 	locales,
 * 	options,
 * 	storeModule,
 * })
 * ```
 *
 * @param map - Map to add the plugin to.
 * @param plugin - Plugin to be added.
 */
export function addPlugin(map: typeof PolarContainer, plugin: PluginContainer) {
	map.store.addPlugin(plugin)
}

/**
 * Remove a plugin from a map by its ID.
 *
 * @param map - Map to remove the plugin from.
 * @param pluginId - ID of the plugin to be removed.
 */
export function removePlugin(map: typeof PolarContainer, pluginId: string) {
	map.store.removePlugin(pluginId)
}

/**
 * Custom element of the POLAR map.
 *
 * You will probably need this to have TypeScript support on `polar-map` elements
 * if you want to do so.
 */
export const PolarMap = defineCustomElement(PolarContainer, {
	configureApp(app) {
		app.use(Pinia)
		app.use(I18Next)
	},
})

/**
 * Registers the custom element for POLAR (i.e., `polar-map`).
 *
 * This has to be called before using POLAR in any way.
 */
export function register() {
	customElements.define('polar-map', PolarMap)
}

/**
 * Creates an HTML map element with a given configuration.
 *
 * Instead of calling this function, you may also create the element yourself.
 * Creating the element yourself yields benefits especially when you use a framework
 * that is more used to creating elements itself and adding properties to them.
 *
 * Remember to always call `register` first.
 *
 * @remarks
 * Whitelisted and confirmed parameters for {@link serviceRegister} include:
 * - WMS:      `id`, `name`, `url`, `typ`, `format`, `version`, `transparent`, `layers`, `styles`, `singleTile`
 * - WFS:      `id`, `name`, `url`, `typ`,  `outputFormat`, `version`, `featureType`
 * - WMTS:     `id`, `name`, `urls`, `typ`, `capabilitiesUrl`, `optionsFromCapabilities`, `tileMatrixSet`, `layers`,
 *             `legendURL`, `format`, `coordinateSystem`, `origin`, `transparent`, `tileSize`, `minScale`, `maxScale`,
 *             `requestEncoding`, `resLength`
 * - OAF:      `id`, `name`, `url`, `typ`, `collection`, `crs`, `bboxCrs`
 * - GeoJSON:  `id`, `name`, `url`, `typ`, `version`, `minScale`, `maxScale`, `legendURL`
 *
 * @privateRemarks
 * In earlier versions of POLAR, this function did a lot of magic.
 * However, the magic moved to the custom element itself, therefore, you may create the element by yourself now.
 *
 * @param mapConfiguration - Configuration options.
 * @param serviceRegister - Service register given through a URL or as an array
 *                          An example for a predefined service register is [the service register of the city of Hamburg](https://geodienste.hamburg.de/services-internet.json).
 *                          Full documentation regarding the configuration can be read [here](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/services.json.md).
 *                          However, not all listed services have been implemented in the `@masterportal/masterportalapi` yet,
 *                          and no documentation regarding implemented properties exists there yet.
 */
export function createMap(
	mapConfiguration: MapConfiguration,
	serviceRegister: string | Record<string, unknown>[]
) {
	// @ts-expect-error | We trust that the element is registered
	const map = document.createElement('polar-map') as typeof PolarContainer
	map.mapConfiguration = mapConfiguration
	map.serviceRegister = serviceRegister
	return map
}

export type SubscribeCallback = (value: unknown, oldValue: unknown) => void

/**
 * @remarks
 * An error is logged if no store can be found with the given name {@link storeName}.
 *
 * @param storeName - Name of the store.
 * @param parameterName - Name of the parameter to update.
 * @param callback - Function to call on updates.
 * @param options - Additional options to give to `watch`.
 */
export function subscribe(
	storeName: string,
	parameterName: string,
	callback: SubscribeCallback,
	options?: WatchOptions
) {
	try {
		return watch(storeToRefs(getStore(storeName))[parameterName], callback, {
			immediate: true,
			...options,
		})
	} catch (e) {
		console.error(e)
	}
}

/**
 * Updates the parameter {@link parameterName | parameter} in the {@link storeName | store} with the {@link payload}.
 *
 * @remarks
 * An error is logged if no store can be found with the given name {@link storeName}.
 *
 * @param storeName - Name of the store.
 * @param parameterName - Name of the parameter to update.
 * @param payload - The payload to update the given parameter with.
 */
export function updateState(
	storeName: string,
	parameterName: string,
	payload: unknown
) {
	try {
		getStore(storeName)[parameterName] = payload
	} catch (e) {
		console.error(e)
	}
}

/**
 * Return the Store instance of the store with the given {@link storeName}.
 *
 * @param storeName - Name of the store to retrieve.
 * @throws Error - If no store with the given name can be found.
 */
function getStore(storeName: string) {
	if (storeName === 'core') {
		return useMainStore()
	}
	if (storeName === 'markers') {
		return useMarkerStore()
	}
	throw new Error(`getStore: Store ${storeName} not found.`)
}

export type * from './types'
export { type PolarContainer }
