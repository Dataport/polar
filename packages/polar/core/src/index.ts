import { defineCustomElement } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'
import { loadKoliBri } from './utils/loadKoliBri'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import { MapConfiguration } from './types'
import { useCoreStore } from './store/useCoreStore'
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
			app.use(I18Next, mapConfiguration.language)
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
}
