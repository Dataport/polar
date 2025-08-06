import { defineStore } from 'pinia'
import { useMainStore } from './main'

export const useCoreStore = defineStore('core', () => {
	const mainStore = useMainStore()

	return {
		oidcToken: mainStore.oidcToken,
	}
})
