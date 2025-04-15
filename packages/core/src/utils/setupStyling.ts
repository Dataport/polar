import createStyle from '@masterportal/masterportalapi/src/vectorStyle/createStyle'
import styleList from '@masterportal/masterportalapi/src/vectorStyle/styleList'
import { MapConfig } from '@polar/lib-custom-types'
import noop from '@repositoryname/noop'
import { Feature, Map } from 'ol'
import { FeatureLike } from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector'

export async function setupStyling(mapConfiguration: MapConfig, map: Map) {
  if (mapConfiguration.featureStyles) {
    await styleList.initializeStyleList(
      // Masterportal specific field not required by POLAR
      {},
      { styleConf: mapConfiguration.featureStyles },
      mapConfiguration.layers.map((layer) => {
        const layerConfig = mapConfiguration.layerConf.find(
          (l) => l.id === layer.id
        )
        if (layerConfig) {
          return {
            ...layer,
            // Required by @masterportal/masterportalapi
            typ: layerConfig.typ,
          }
        }
        return layer
      }),
      // Masterportal specific field not required by POLAR
      [],
      // Callback currently yields no relevant benefit
      noop
    )
    map.getLayers().forEach((layer) => {
      if (!layer.get('styleId')) {
        return
      }
      const styleObject = styleList.returnStyleObject(layer.get('styleId'))
      if (styleObject) {
        ;(layer as VectorLayer).setStyle((feature: Feature | FeatureLike) =>
          createStyle.createStyle(
            styleObject,
            feature,
            feature.get('features') !== undefined,
            // NOTE: This field may be implemented in the future to be able to style points with graphics
            ''
          )
        )
      }
    })
  }
}
