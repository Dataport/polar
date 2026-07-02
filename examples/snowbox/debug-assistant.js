import { getStore } from '@polar/polar'

function initializeDebugAssistant() {
	const map = document.getElementById('snowbox')
	const coreStore = getStore(map, 'core')
	const activePluginIds = coreStore.activePluginIds

	window.map = map
	window.olMap = coreStore.map
	window.coreStore = coreStore
	window.activePluginIds = activePluginIds
	for (const pluginId of activePluginIds) {
		window[`${pluginId}Store`] = coreStore.getPluginStore(pluginId)
	}
}

// We want to load as late as possible.
// Especially, the timeout stuff from snowbox code should be done when doing this.
setTimeout(() => {
	initializeDebugAssistant()

	// 7 seconds may be long sometimes, inform the developer about it.
	// eslint-disable-next-line no-console
	console.info('POLAR debug assistant was successfully initialized')
}, 7000)
