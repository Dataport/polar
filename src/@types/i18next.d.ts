import 'i18next'
import type { BundledPluginId, BundledPluginLocaleResources } from '@/core'
import type { resourcesEn as core } from '@/core/locales'
import type { CoreId } from '@/core/vuePlugins/i18next'

declare module 'i18next' {
	interface CustomTypeOptions {
		enableSelector: true
		resources: {
			[T in typeof CoreId | BundledPluginId]: T extends typeof CoreId
				? typeof core
				: BundledPluginLocaleResources<T>
		}
	}
}
