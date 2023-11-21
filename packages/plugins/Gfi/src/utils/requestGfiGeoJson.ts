import { Feature as GeoJsonFeature } from 'geojson'
import { GeoJSON } from 'ol/format'

const writer = new GeoJSON()

/**
 * Returns features from GeoJSON layer as GeoJSON.
 */
export default ({ map, coordinate, layer }): Promise<GeoJsonFeature[]> =>
  Promise.resolve(
    map
      .getFeaturesAtPixel(map.getPixelFromCoordinate(coordinate), {
        layerFilter: (candidate) => candidate === layer,
      })
      .map((feature) => JSON.parse(writer.writeFeature(feature)))
  )
