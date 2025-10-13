import type { PluginContainer, PolarContainer } from '@/core'

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
