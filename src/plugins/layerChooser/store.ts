/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/layerChooser/store
 */
/* eslint-enable tsdoc/syntax */

import { rawLayerList } from '@masterportal/masterportalapi'
import WMSCapabilities from 'ol/format/WMSCapabilities'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { computed, ref } from 'vue'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the layer chooser.
 */
/* eslint-enable tsdoc/syntax */
export const useLayerChooserStore = defineStore('plugins/layerChooser', () => {
	const capabilities = ref<Record<string, string | null>>({})
	const openedOptions = ref('')
	function setupPlugin() {}
	const wmsCapabilitiesAsJsonById = computed(
		() =>
			(id: string): object | null => {
				const xml = capabilities.value[id]
				if (xml) {
					try {
						return new WMSCapabilities().read(xml)
					} catch (e) {
						console.error(`Error reading xml '${xml}' for id '${id}'.`, e)
					}
				}
				return null
			}
	)
	function teardownPlugin() {}

	function loadCapabilities(id: string) {
		const previous = capabilities.value[id]
		if (typeof previous !== 'undefined' && previous !== null) {
			console.warn(
				`Re-fired loadCapabilities on id '${id}' albeit the GetCapabilities have already been successfully fetched. No re-fetch will occur.`
			)
			return
		}

		// block access to prevent duplicate requests
		capabilities.value[id] = null

		const service = rawLayerList.getLayerWhere({ id })
		if (!service || !service.url || !service.version || !service.typ) {
			console.error(`Missing data for service '${service}' with id '${id}'.`)
			return
		}

		const capabilitiesUrl = `${service.url}?service=${service.typ}&version=${service.version}&request=GetCapabilities`

		fetch(capabilitiesUrl)
			.then((response) => response.text())
			.then((string) => (capabilities.value[id] = string))
			.catch((e: unknown) => {
				console.error(
					`@polar/core: Capabilities from ${capabilitiesUrl} could not be fetched.`,
					e
				)
				capabilities.value[id] = null
			})
	}

	return {
		/** @internal */
		openedOptions,
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
