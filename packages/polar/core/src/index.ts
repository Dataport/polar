import { defineCustomElement } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'
import { loadKoliBri } from './utils/loadKoliBri'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import { MapConfiguration, MasterportalApiConfiguration } from './types'
import { useCoreStore } from './store/useCoreStore'
import { rawLayerList } from '@masterportal/masterportalapi'

/**
 * Initialize map and setup all relevant functionality.
 * Registers the custom element for the polar map.
 *
 * @deprecated Parameter `containerId` is deprecated in an upcoming release.
 * Set the variable to an empty string to avoid warnings and be able to use POLAR as a WebComponent.
 *
 * @param containerId - ID of the container element where the map will be rendered.
 * @param mapConfiguration - Configuration options.
 * @param serviceRegister - Service register given through a URL or as an array. Will be required in an upcoming release instead of configuring it via layerConf in combination with rawLayerList.initializeLayerList.
 * @param tagName - Tag name for the custom element.
 * @param externalKoliBri - Re-use theme and implementation of KoliBri in the outer application.
 */
export async function createMap(
	containerId: string,
	mapConfiguration: MapConfiguration,
	serviceRegister?: string | MasterportalApiConfiguration['layerConf'],
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

			if (typeof serviceRegister === 'string') {
				rawLayerList.initializeLayerList(
					serviceRegister,
					(layerConf: MasterportalApiConfiguration['layerConf']) =>
						(coreStore.configuration.layerConf = layerConf)
				)
			} else if (Array.isArray(serviceRegister)) {
				coreStore.configuration.layerConf = serviceRegister
			}
		},
	})

	customElements.define(tagName, PolarMap)
}
