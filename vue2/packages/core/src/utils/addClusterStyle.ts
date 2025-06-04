import { MapConfig } from '@polar/lib-custom-types'
import { Feature } from 'ol'
import { InvisibleStyle, isVisible } from '@polar/lib-invisible-style'
import { getDefaultStyle } from './markers'

// optimization to keep getDefaultStyle memoization intact
const defaultStyle = {}

export const addClusterStyle = (mapConfiguration: MapConfig): MapConfig => {
  mapConfiguration.layerConf.forEach((layerConfiguration) => {
    if (layerConfiguration.clusterDistance !== undefined) {
      const style =
        mapConfiguration.extendedMasterportalapiMarkers?.defaultStyle ||
        defaultStyle
      // @masterportal/masterportalapi hook
      layerConfiguration.style = (feature: Feature) => {
        const visibleFeaturesCount: number = (
          feature.get('features') || []
        ).filter(isVisible).length
        if (visibleFeaturesCount === 0) {
          return InvisibleStyle
        }
        return getDefaultStyle(style, visibleFeaturesCount > 1)
      }
    }
  })
  return mapConfiguration
}
