import type { SetupStoreDefinition } from 'pinia'
import type { Component } from 'vue'
import type { NineLayoutTag } from '../utils/NineLayoutTag'
import type { Locale } from './main'

import type { PluginId as FullscreenPluginId } from '@/plugins/fullscreen'
import type { useFullscreenStore as FullscreenStore } from '@/plugins/fullscreen/store'

import type { PluginId as IconMenuPluginId } from '@/plugins/iconMenu'
import { useIconMenuStore as IconMenuStore } from '@/plugins/iconMenu/store'

import { PluginId as ToastPluginId } from '@/plugins/toast'
import { useToastStore as ToastStore } from '@/plugins/toast/store'

export interface PluginOptions {
	displayComponent?: boolean
	layoutTag?: keyof typeof NineLayoutTag
}

export type PolarPluginStore = SetupStoreDefinition<
	string,
	{
		setupPlugin?: () => void
		teardownPlugin?: () => void
	}
>

/** @internal */
export type BundledPluginId =
	| typeof FullscreenPluginId
	| typeof IconMenuPluginId
	| typeof ToastPluginId

type CheckPlugin<
	T extends BundledPluginId,
	I extends BundledPluginId,
	S extends PolarPluginStore,
> = T extends I ? S : never

export type BundledPluginStores<T extends BundledPluginId> =
	| CheckPlugin<T, typeof FullscreenPluginId, typeof FullscreenStore>
	| CheckPlugin<T, typeof IconMenuPluginId, typeof IconMenuStore>
	| CheckPlugin<T, typeof ToastPluginId, typeof ToastStore>

/** @internal */
export type ExternalPluginId = `external-${string}`

/** @internal */
export type PluginId = BundledPluginId | ExternalPluginId

export interface PluginContainer {
	/**
	 * Unique technical identifier.
	 *
	 * For bundled plugins, this is its name, e.g. `fullscreen`.
	 *
	 * For external plugins, use `external-` as a prefix and ensure uniqueness.
	 * For publicly published plugins, it is recommended to use
	 * `polar-plugin-X` as your package name and use `external-X` as ID.
	 *
	 * Please do not use `external-X` when `X` is a bundled plugin.
	 *
	 * @example `fullscreen`
	 */
	id: PluginId

	/**
	 * A Vue component if required.
	 *
	 * The component will be rendered by POLAR over the map.
	 * The position is either to be determined by the plugin if `layout === 'standard'`
	 * or will be determined by the layout.
	 */
	component?: Component

	/**
	 * Locales used in the plugin.
	 *
	 * The locales will be loaded to the namespace that equals the plugin's ID.
	 */
	locales?: Locale[]

	/**
	 * Configuration options. Please also note that all configuration added via plugin constructors can be overridden in
	 * the {@link createMap | `createMap`'s parameter `mapConfiguration`} .
	 *
	 * You may use either object (or a mix of them) to create the configuration, e.g. use the constructors for a base
	 * configuration and the `mapConfiguration` object to override it for various use cases.
	 *
	 * How exactly you do this is up to you and influences the minimum API call requirements your client has.
	 */
	options?: PluginOptions

	/**
	 * Pinia store module if required.
	 * If the storeModule features a `setupPlugin` action, it will be executed automatically after initialization.
	 * If the storeModule features a `teardownPlugin` action, it will be executed automatically before unloading.
	 */
	storeModule?: PolarPluginStore
}
