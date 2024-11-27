import { Feature as GeoJsonFeature } from 'geojson'
import { Feature, Map } from 'ol'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import { FeatureLike } from 'ol/Feature'

const writer = new GeoJSON()

const getNestedFeatures = (
  feature: Feature | FeatureLike
): Feature | Feature[] | FeatureLike =>
  feature instanceof Feature
    ? feature.get('features')?.length
      ? feature.get('features')
      : feature
    : feature

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
    (coordinateOrExtent.length === 2
      ? map.getFeaturesAtPixel(map.getPixelFromCoordinate(coordinateOrExtent), {
          layerFilter: (candidate) => candidate === layer,
        })
      : // @ts-expect-error | Layers reaching this place have a source
        layer
          .getSource()
          .getFeaturesInExtent(coordinateOrExtent)
          .map(getNestedFeatures)
          .flat(1)
    )
      .map((feature) =>
        feature instanceof Feature
          ? JSON.parse(writer.writeFeature(feature))
          : false
      )
      // remove FeatureLikes
      .filter((x) => x)
  )
