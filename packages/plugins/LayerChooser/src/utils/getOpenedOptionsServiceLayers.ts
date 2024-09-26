import { LayerConfigurationOptionLayers } from '@polar/lib-custom-types'
import {
  findLayerTitleInCapabilitiesByName,
  findLegendUrlInCapabilitiesByName,
} from './findInCapabilities'

export const getOpenedOptionsServiceLayers = (
  technicalLayerNames: string[],
  layers: LayerConfigurationOptionLayers,
  wmsCapabilitiesJson: object
) =>
  technicalLayerNames.map((technicalLayerName) => ({
    layerName: technicalLayerName,
    displayName:
      (layers.title === true
        ? findLayerTitleInCapabilitiesByName(
            wmsCapabilitiesJson,
            technicalLayerName
          )
        : layers.title === false
        ? technicalLayerName
        : layers.title?.[technicalLayerName]) || technicalLayerName,
    layerImage:
      layers.legend === false
        ? null
        : layers.legend === true
        ? findLegendUrlInCapabilitiesByName(
            wmsCapabilitiesJson,
            technicalLayerName
          )
        : layers.legend?.[technicalLayerName] || null,
  }))
