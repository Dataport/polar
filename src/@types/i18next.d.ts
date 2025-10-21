import 'i18next'
import type { LocaleResources } from '@/core'

declare module 'i18next' {
	interface CustomTypeOptions {
		enableSelector: true
		resources: LocaleResources
	}
}
