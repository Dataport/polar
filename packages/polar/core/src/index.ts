import { defineCustomElement } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'
import { loadKoliBri } from './utils/loadKoliBri'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import { MapConfiguration } from './types'
import { useCoreStore } from './store/useCoreStore'

/**
 * Initialize map and setup all relevant functionality.
 * Registers the custom element for the polar map.
 *
 * @deprecated Parameter `containerId` is deprecated in an upcoming release.
 * Set the variable to an empty string to avoid warnings and be able to use POLAR as a WebComponent.
 *
 * @param containerId - ID of the container element where the map will be rendered.
 * @param mapConfiguration - Configuration options.
 * @param tagName - Tag name for the custom element.
 * @param externalKoliBri - Re-use theme and implementation of KoliBri in the outer application.
 */
export async function createMap(
	containerId: string,
	mapConfiguration: MapConfiguration,
	tagName = 'polar-map',
	externalKoliBri = false
) {
	await loadKoliBri(tagName)

	if (containerId) {
		// TODO: Do the setup like it is currently done in vue@2
	}

	const PolarMap = defineCustomElement(PolarMapCE, {
		configureApp(app) {
			app.use(I18Next, mapConfiguration.language)
			app.use(Pinia)

			const coreStore = useCoreStore()

			coreStore.configuration = {
				...coreStore.configuration,
				...mapConfiguration,
			}
		},
	})

	customElements.define(tagName, PolarMap)
}
