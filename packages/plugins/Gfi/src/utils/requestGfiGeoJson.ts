import { Feature as GeoJsonFeature } from 'geojson'
import { Feature, Map } from 'ol'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'

/**
 * Returns features from GeoJSON layer as GeoJSON.
 */
export default ({
  map,
  coordinateOrExtent,
  layer,
}: {
  map: Map
  coordinateOrExtent: [number, number] | [number, number, number, number]
  layer: VectorLayer<Feature>
}): Promise<GeoJsonFeature[]> =>
  Promise.resolve(
    coordinateOrExtent.length === 2
      ? map.getFeaturesAtPixel(map.getPixelFromCoordinate(coordinateOrExtent), {
          layerFilter: (candidate) => candidate === layer,
        })
      : // @ts-expect-error | Layers reaching this place have a source TODO: Get a GeoJSON source and check if this works
        layer
          .getSource()
          .getFeaturesInExtent(coordinateOrExtent)
          .map((feature) =>
            feature instanceof Feature
              ? JSON.parse(new GeoJSON().writeFeature(feature))
              : false
          )
          // remove FeatureLikes
          .filter((x) => x)
  )
