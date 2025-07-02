import { storeToRefs } from 'pinia'
import { defineCustomElement, watch, type WatchOptions } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'
import { loadKoliBri } from './utils/loadKoliBri'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import { MapConfiguration } from './types'
import { useCoreStore } from './stores/useCoreStore'
import defaults from './utils/defaults'

/**
 * Initialize map and setup all relevant functionality.
 * Registers the custom element for the polar map.
 *
 * @param mapConfiguration - Configuration options.
 * @param serviceRegister - Service register given through a URL or as an array. Will be required in an upcoming release instead of configuring it via layerConf in combination with rawLayerList.initializeLayerList.
 * @param tagName - Tag name for the custom element.
 * @param externalKoliBri - Re-use theme and implementation of KoliBri in the outer application.
 */
export async function createMap(
	mapConfiguration: MapConfiguration,
	serviceRegister?: string | Record<string, unknown>[],
	tagName = 'polar-map',
	externalKoliBri = false
) {
	await loadKoliBri(tagName)

	const PolarMap = defineCustomElement(PolarMapCE, {
		configureApp(app) {
			app.use(I18Next, {
				initialLanguage: mapConfiguration.language,
				locales: mapConfiguration.locales,
			})
			app.use(Pinia)

			const coreStore = useCoreStore()

			coreStore.configuration = {
				...defaults,
				...mapConfiguration,
			}
			coreStore.serviceRegister = serviceRegister
		},
	})

	customElements.define(tagName, PolarMap)

	return {
		subscribe,
	}
}

type SubscribeCallback = (value: unknown, oldValue: unknown) => void

export function subscribe(
	path: string,
	callback: SubscribeCallback,
	options?: WatchOptions
) {
	const steps = path.split('/')
	const isCore = steps.length === 1

	// const store = isCore ? useCoreStore() : getStore(steps[0])
	const parameterName = steps[isCore ? 0 : 1]

	return watch(storeToRefs(useCoreStore())[parameterName], callback, {
		immediate: true,
		...options,
	})
}

// TODO(dopenguin): Implement this once plugins are added so that the respective store is selected here.
// function getStore(storeName: string) {}
