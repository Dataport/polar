import { useCoreStore } from '@/core/stores/export'
let loaderKeyCounter = 0

export function indicateLoading() {
	const coreStore = useCoreStore()
	const loadingIndicatorStore = coreStore.getPluginStore('loadingIndicator')
	if (!loadingIndicatorStore) {
		return () => {}
	}

	const loaderKey = `lib-indicate-loading-${loaderKeyCounter++}`
	loadingIndicatorStore.addLoadingKey(loaderKey)
	return () => {
		loadingIndicatorStore.removeLoadingKey(loaderKey)
	}
}
