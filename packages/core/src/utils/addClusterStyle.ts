import { MapConfig } from '@polar/lib-custom-types'
import { Feature } from 'ol'
import { getDefaultStyle } from './markers'

// optimization to keep getDefaultStyle memoization intact
const defaultStyle = {}

export const addClusterStyle = (mapConfiguration: MapConfig): MapConfig => {
  mapConfiguration.layerConf.forEach((layerConfiguration) => {
    if (layerConfiguration.clusterDistance !== undefined) {
      const style =
        mapConfiguration.extendedMasterportalapiMarkers.defaultStyle ||
        defaultStyle
      // @masterportal/masterportalapi hook
      layerConfiguration.style = (feature: Feature) =>
        getDefaultStyle(style, feature.get('features')?.length > 1)
    }
  })
  return mapConfiguration
}
