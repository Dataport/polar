import type { resourcesEn as shared } from '@/locales'
import type { resourcesEn as core } from '../locales'
import type { CoreId, SharedId } from '../types'
import type { BundledPluginId, BundledPluginLocaleResources } from './plugin'

/** @internal */
export type LocaleResources = {
	[
		T in typeof CoreId | typeof SharedId | BundledPluginId
	]: T extends BundledPluginId
		? BundledPluginLocaleResources<T>
		: T extends typeof SharedId
			? typeof shared
			: typeof core
}

type ToLocaleOverride<T> = T extends string
	? string
	: { [P in keyof T]?: ToLocaleOverride<T[P]> }

/**
 * Overrides for the built-in translations.
 */
export interface LocaleOverride {
	/**
	 * Locale resources to override in the given language.
	 */
	resources: ToLocaleOverride<LocaleResources>

	/**
	 * Language key as described in the i18next documentation.
	 */
	type: string
}
