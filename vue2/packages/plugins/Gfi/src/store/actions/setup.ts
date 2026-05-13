import { PolarActionContext, PolarStore } from '@polar/lib-custom-types'
import { GeoJsonProperties } from 'geojson'
import getCluster from '@polar/lib-get-cluster'
import { GfiGetters, GfiState } from '../../types'
import { getOriginalFeature } from '../../utils/getOriginalFeature'

export function setupZoomListeners(
  this: PolarStore<GfiState, GfiGetters>,
  { dispatch, getters, rootGetters }: PolarActionContext<GfiState, GfiGetters>
) {
  if (getters.gfiConfiguration.featureList) {
    this.watch(
      () => rootGetters.zoomLevel,
      () => {
        const {
          featureInformation,
          listableLayerSources,
          visibleWindowFeatureIndex,
          windowFeatures,
        } = getters

        if (windowFeatures.length) {
          const layerId: string =
            // @ts-expect-error | if windowFeatures has features, visibleWindowFeatureIndex is in the range of possible features
            windowFeatures[visibleWindowFeatureIndex].polarInternalLayerKey
          const selectedFeatureProperties: GeoJsonProperties = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _gfiLayerId: layerId,
            ...featureInformation[layerId][visibleWindowFeatureIndex]
              .properties,
          }
          const originalFeature = getOriginalFeature(
            listableLayerSources,
            selectedFeatureProperties
          )
          if (originalFeature) {
            dispatch('setOlFeatureInformation', {
              feature: getCluster(
                rootGetters.map,
                originalFeature,
                '_gfiLayerId'
              ),
            })
          }
        }
      }
    )
  }
}
