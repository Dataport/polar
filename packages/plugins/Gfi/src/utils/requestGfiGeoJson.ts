import { Feature as GeoJsonFeature } from 'geojson'
import { Feature, Map } from 'ol'
import { GeoJSON } from 'ol/format'
import BaseLayer from 'ol/layer/Base'

/**
 * Returns features from GeoJSON layer as GeoJSON.
 */
export default ({
  map,
  coordinate,
  layer,
}: {
  map: Map
  coordinate: [number, number]
  layer: BaseLayer
}): Promise<GeoJsonFeature[]> =>
  Promise.resolve(
    map
      .getFeaturesAtPixel(map.getPixelFromCoordinate(coordinate), {
        layerFilter: (candidate) => candidate === layer,
      })
      .map((feature) =>
        feature instanceof Feature
          ? JSON.parse(new GeoJSON().writeFeature(feature))
          : false
      )
      // remove FeatureLikes
      .filter((x) => x)
  )
