import { defineStore } from 'pinia'
import { useMainStore } from './main'

export const useCoreStore = defineStore('core', () => {
	const mainStore = useMainStore()

	return {
		configuration: mainStore.configuration,
		oidcToken: mainStore.oidcToken,
		lightElement: mainStore.lightElement,
		shadowRoot: mainStore.shadowRoot,
	}
})
