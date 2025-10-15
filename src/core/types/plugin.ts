import type { SetupStoreDefinition } from 'pinia'
import type { Component } from 'vue'
import type { NineLayoutTag } from '../utils/NineLayoutTag'
import type { Locale } from './locales'

import type { PluginId as FullscreenPluginId } from '@/plugins/fullscreen'
import type { useFullscreenStore as FullscreenStore } from '@/plugins/fullscreen/store'
import type { resourcesEn as FullscreenResources } from '@/plugins/fullscreen/locales'

import type { PluginId as IconMenuPluginId } from '@/plugins/iconMenu'
import type { useIconMenuStore as IconMenuStore } from '@/plugins/iconMenu/store'
import type { resourcesEn as IconMenuResources } from '@/plugins/iconMenu/locales'

import type { PluginId as LayerChooserPluginId } from '@/plugins/layerChooser'
import type { useLayerChooserStore as LayerChooserStore } from '@/plugins/layerChooser/store'
import type { resourcesEn as LayerChooserResources } from '@/plugins/layerChooser/locales'

import type { PluginId as LoadingIndicatorId } from '@/plugins/loadingIndicator'
import type { useLoadingIndicatorStore as LoadingIndicatorStore } from '@/plugins/loadingIndicator/store'

import type { PluginId as ToastPluginId } from '@/plugins/toast'
import type { useToastStore as ToastStore } from '@/plugins/toast/store'
import type { resourcesEn as ToastResources } from '@/plugins/toast/locales'

export interface PluginOptions {
	displayComponent?: boolean
	layoutTag?: keyof typeof NineLayoutTag
}

export type PolarPluginStore<
	T extends {
		setupPlugin?: () => void
		teardownPlugin?: () => void
	} = {
		setupPlugin?: () => void
		teardownPlugin?: () => void
	},
> = SetupStoreDefinition<string, T>

/** @internal */
export type BundledPluginId =
	| typeof FullscreenPluginId
	| typeof IconMenuPluginId
	| typeof LayerChooserPluginId
	| typeof LoadingIndicatorId
	| typeof ToastPluginId

type GetPluginStore<
	T extends BundledPluginId,
	I extends BundledPluginId,
	// TODO: This fixes the type error, but relaxes type-checking for the plugin store too much.
	// However, it is not clear if Pinia's type system allows for stronger checks at the moment.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends PolarPluginStore<any>,
> = T extends I ? S : never

/** @internal */
export type BundledPluginStores<T extends BundledPluginId> =
	| GetPluginStore<T, typeof FullscreenPluginId, typeof FullscreenStore>
	| GetPluginStore<T, typeof IconMenuPluginId, typeof IconMenuStore>
	| GetPluginStore<T, typeof LayerChooserPluginId, typeof LayerChooserStore>
	| GetPluginStore<T, typeof LoadingIndicatorId, typeof LoadingIndicatorStore>
	| GetPluginStore<T, typeof ToastPluginId, typeof ToastStore>

type GetPluginResources<
	T extends BundledPluginId,
	I extends BundledPluginId,
	S extends Locale['resources'],
> = T extends I ? S : never

/** @internal */
export type BundledPluginLocaleResources<T extends BundledPluginId> =
	| GetPluginResources<T, typeof FullscreenPluginId, typeof FullscreenResources>
	| GetPluginResources<T, typeof IconMenuPluginId, typeof IconMenuResources>
	| GetPluginResources<
			T,
			typeof LayerChooserPluginId,
			typeof LayerChooserResources
	  >
	| GetPluginResources<T, typeof ToastPluginId, typeof ToastResources>

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
	 * Whether the plugin is independently rendered.
	 *
	 * @internal
	 * @defaultValue true
	 */
	independent?: boolean

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
