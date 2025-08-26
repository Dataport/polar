import 'i18next'
import type { resourcesEn as core } from '@/core/locales'
import type { BundledPluginId, BundledPluginLocaleResources } from '@/core'
type CoreId = 'core'

declare module 'i18next' {
	interface CustomTypeOptions {
		enableSelector: true
		resources: {
			[T in CoreId | BundledPluginId]: T extends CoreId
				? typeof core
				: BundledPluginLocaleResources<T>
		}
	}
}
