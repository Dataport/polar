import { Resource } from 'i18next'

export interface Locale {
	resources: Resource
	/** Language key as described in the i18next documentation */
	type: string
}
