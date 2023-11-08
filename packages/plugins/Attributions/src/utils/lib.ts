import { Collection } from 'ol'
import BaseLayer from 'ol/layer/Base'
import { Attribution, MapConfig } from '@polar/lib-custom-types'

/**
 * Returns a string which contains the attributions for every visible Layer
 * @param layers - the visible layers which are stored in the state
 * @param attributions - the List of Attributions for this Map, which is stored in the state
 * @param staticAttributions - list of attributions to always display
 * @returns contains all (copyRight-)information of this Map.
 */
export function updateMapInfo(
  layers: string[],
  attributions: Attribution[],
  staticAttributions: string[]
): string[] {
  return buildMapInfo(
    getVisibleAttributions(layers, attributions),
    staticAttributions
  )
}

/**
 * looks for all Layers that are currently visible
 * @param layers - contains all Layers
 * @returns an array of LayerIDs
 */
export function getVisibleLayers(layers: Collection<BaseLayer>): string[] {
  const layerIDs: string[] = []
  layers.forEach((layer) => {
    // Only layers added through the services include the id property
    if (layer.getVisible() && layer.get('id')) {
      layerIDs.push(layer.get('id'))
    }
  })
  return layerIDs
}

/**
 * Builds a string which contains the attributions for every visible Layer
 * @param infos - are all visible Layers
 * @param staticAttributions - list of attributions to always display
 * @returns an array of localizing string which contain all (copyRight-)information of this Map.
 */
function buildMapInfo(
  infos: Attribution[],
  staticAttributions: string[] = []
): string[] {
  const text: string[] = []
  infos.forEach((attribution) => {
    text.push(attribution.title)
  })
  staticAttributions.forEach((attribution) => text.push(attribution))
  return text
}

/**
 * checks every layer (passed in layers) for visibility and returns an Attribution[] for every visible Layer
 * @param layers - is an array of LayerIDs (number[]) for visible Layers
 * @param attributions - is an array of all Attributions for this Map
 * @returns an array for all attributions whose id matches the id of a visible layer
 */
function getVisibleAttributions(
  layers: string[],
  attributions: Attribution[]
): Attribution[] {
  const visibleAttributions: Attribution[] = []
  attributions.forEach((attribution) => {
    if (layers.includes(attribution.id)) {
      visibleAttributions.push(attribution)
    }
  })
  return visibleAttributions
}

/**
 * builds all attributions for a Map
 * @param mapConfiguration - the map configuration
 * @param layers - contains all Layers
 * @returns an Array of Attributions
 */
export function buildAttributions(
  mapConfiguration: MapConfig,
  layers: Collection<BaseLayer>
): Attribution[] {
  // if attributions are defined in the mapConfiguration get them
  let attributions: Attribution[] = []
  if (mapConfiguration?.attributions?.layerAttributions) {
    attributions = mapConfiguration.attributions.layerAttributions
  }

  // check if we got an attribution for each layer
  layers?.forEach((layer) => {
    const layerID: string = layer.get('id')

    let a: Attribution = attributions.find(
      (attribution) => layerID === attribution.id
    ) as Attribution
    // if found something, print the information (by setting it as source attribution text)
    if (a) {
      a.title = a.title.includes('common:')
        ? a.title
        : formatAttributionText(a.title)
    } else {
      // if nothing found, print URL for source
      a = { id: layerID, title: '' }
      a.title = getLayerSource(mapConfiguration, a.id)
      attributions.push(a)
    }
  })

  return attributions
}

/**
 * Looks for the proxyUrl in the MapConfig
 * @param mapConfig - tha MapConfiguration
 * @param id - the LayerID
 * @returns a string which contain the proxyUrl for the LayerID
 */
function getLayerSource(mapConfig: MapConfig, id: string): string {
  const layerSource = mapConfig.layers?.find((layer) => id === layer.id)
  return layerSource?.proxyUrl || ''
}

/**
 * Formats the attribution-string and replaces <YEAR> with the current year and
 * <MONTH> with the current month.
 * @param text - the attribution text defined in the mapConfig
 * @returns a formatted string, which can be displayed in the Attributions
 */
function formatAttributionText(text: string): string {
  const now = new Date()
  return text
    .replaceAll('{{YEAR}}', now.getFullYear().toString())
    .replaceAll('{{MONTH}}', `${now.getMonth() + 1}`.padStart(2, '0'))
}
