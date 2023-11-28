import { Feature as GeoJsonFeature } from 'geojson'
import { Feature, Map } from 'ol'
import { GeoJSON } from 'ol/format'
import { Layer } from 'ol/layer'

const writer = new GeoJSON()

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
  layer: Layer
}): Promise<GeoJsonFeature[]> =>
  Promise.resolve(
    map
      .getFeaturesAtPixel(map.getPixelFromCoordinate(coordinate), {
        layerFilter: (candidate) => candidate === layer,
      })
      .map((feature) =>
        feature instanceof Feature
          ? JSON.parse(writer.writeFeature(feature))
          : false
      )
      // remove FeatureLikes
      .filter((x) => x)
  )
