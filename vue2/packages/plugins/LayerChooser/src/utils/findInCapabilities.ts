/* NOTE: dig up from Capabilities by OGC WMS Capabilities specification E.1 in
 * https://portal.ogc.org/files/?artifact_id=14416
 * OL currently has no TS support for its return object, hence :any'ing here */

/**
 * Finds a named layer from a root layer (array). First-found is returned,
 * assuming that not multiple layers will have the same name, since they're a
 * distinguishing feature for layer enabling/disabling via URL. Layers can be
 * nested arbitrarily deep.
 * NOTE Should we start doing this a lot, consider memoization
 * @param layer - layer from ol/format/WMSCapabilities
 * @param name - name to search for
 * @returns capabilities layer with matching name
 */
const deepLayerFind = (layer, name: string) => {
  if (Array.isArray(layer)) {
    return (
      layer.map((l) => deepLayerFind(l, name)).find((l) => l !== null) || null
    )
  } else if (typeof layer === 'object') {
    if (layer.Name === name) {
      return layer
    } else if (layer.Layer) {
      return deepLayerFind(layer.Layer, name)
    }
  }

  // layer is minOccurs="0", so we may always end up empty-handed
  return null
}

/**
 * @param style - style of a layer from ol/format/WMSCapabilities
 * @returns array of all found legend URLs
 */
const getAllLegendURLs = (style): string[] =>
  (Array.isArray(style) ? style : [style])
    .map((styleObject) =>
      (Array.isArray(styleObject.LegendURL)
        ? styleObject.LegendURL
        : typeof styleObject.LegendURL === 'object'
        ? [styleObject.LegendURL]
        : []
      ).map((legendUrl) => legendUrl.OnlineResource)
    )
    .flat(1)

/**
 * @param capabilities - capabilities from ol/format/WMSCapabilities
 * @param name - name of the layer to find title for
 * @returns title, or empty string if not found
 */
export const findLayerTitleInCapabilitiesByName = (
  capabilities,
  name: string
): string => {
  const layer = deepLayerFind(capabilities.Capability.Layer, name)
  return layer?.Title || ''
}

/**
 * @param capabilities - capabilities from ol/format/WMSCapabilities
 * @param name - name of the layer to find legendURL for
 * @returns legend URL as string, or empty string if not found
 */
export const findLegendUrlInCapabilitiesByName = (
  capabilities,
  name: string
): string => {
  const layer = deepLayerFind(capabilities.Capability.Layer, name)
  const style = layer?.Style
  if (!style) {
    return ''
  }
  const urls: string[] = getAllLegendURLs(style)
  // NOTE: choosing URL is more complex when supporting layer styles
  return urls[0] || ''
}
