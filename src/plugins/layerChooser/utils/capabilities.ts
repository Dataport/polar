import { rawLayerList } from '@masterportal/masterportalapi'
import { toMerged } from 'es-toolkit'
import WMSCapabilities from 'ol/format/WMSCapabilities'

import type { LayerConfiguration, LayerConfigurationOptionLayers } from '@/core'

import {
	findLayerTitleInCapabilitiesByName,
	findLegendUrlInCapabilitiesByName,
} from './findInCapabilities'

function wmsCapabilitiesAsJsonById(
	id: string,
	capabilities: Record<string, string | null>
): object | null {
	const xml = capabilities[id]
	if (xml) {
		try {
			return new WMSCapabilities().read(xml)
		} catch (e) {
			console.error(`Error reading xml '${xml}' for id '${id}'.`, e)
		}
	}
	return null
}

export function loadCapabilities(
	configuredLayers: LayerConfiguration[],
	capabilities: Record<string, string | null>
): Promise<Record<string, string | null>> {
	return Promise.all(
		configuredLayers.map(async (layer): Promise<[string, string | null]> => {
			const { id } = layer
			const layerOptions = layer.options?.layers
			if (
				layerOptions &&
				(layerOptions.title === true || layerOptions.legend === true)
			) {
				const previousCapabilities = capabilities[id]
				if (typeof previousCapabilities === 'string') {
					console.warn(
						`Re-fired loadCapabilities on id '${id}' albeit the GetCapabilities have already been successfully fetched. No re-fetch will occur.`
					)
					return [id, null]
				}

				const service = rawLayerList.getLayerWhere({ id: layer.id })
				if (!service || !service.url || !service.version || !service.typ) {
					console.error(
						`Missing data for service '${service}' with id '${id}'.`
					)
					return [id, null]
				}

				const capabilitiesUrl = `${service.url}?service=${service.typ}&version=${service.version}&request=GetCapabilities`

				try {
					const response = await fetch(capabilitiesUrl)
					return [id, await response.text()]
				} catch (e: unknown) {
					console.error(
						`Capabilities from ${capabilitiesUrl} could not be fetched.`,
						e
					)
					return [id, null]
				}
			}
			return [id, null]
		})
	).then((values) =>
		values.reduce((acc, [id, value]) => toMerged(acc, { [id]: value }), {})
	)
}

export function prepareLayersWithOptions(
	id: string,
	capabilities: Record<string, string | null>,
	layerOptions: LayerConfigurationOptionLayers
) {
	const rawLayer: { layers: string } = rawLayerList.getLayerWhere({ id })
	const wmsCapabilitiesJson = wmsCapabilitiesAsJsonById(id, capabilities)
	return {
		[id]: (layerOptions.order?.split(',') || rawLayer.layers.split(',')).map(
			(layerName) => ({
				layerName,
				displayName:
					layerOptions.title === true && wmsCapabilitiesJson
						? findLayerTitleInCapabilitiesByName(wmsCapabilitiesJson, layerName)
						: layerOptions.title === false
							? layerName
							: layerOptions.title?.[layerName] || layerName,
				layerImage:
					layerOptions.legend === true && wmsCapabilitiesJson
						? findLegendUrlInCapabilitiesByName(wmsCapabilitiesJson, layerName)
						: layerOptions.legend === false
							? null
							: layerOptions.legend?.[layerName] || null,
			})
		),
	}
}
