import VectorLayer from 'ol/layer/Vector'
import { Vector } from 'ol/source'
import { GeoJSON } from 'ol/format'
import { Feature as GeoJsonFeature } from 'geojson'

const converter = new GeoJSON()

export const featureDisplayLayer = new VectorLayer({
  source: new Vector({
    features: [],
  }),
})

featureDisplayLayer.set('polarInternalId', 'pluginGfiFeatureDisplay')
featureDisplayLayer.setZIndex(90)

function isVectorSource(source): source is Vector {
  return source instanceof Vector
}

/**
 * reset feature layer's features.
 */
export function clear(): void {
  const source = featureDisplayLayer.getSource()
  if (isVectorSource(source)) {
    source.clear()
  }
}

/**
 * add feature from jsonable GeoJson object.
 * @param feature - to be added to the gfi layer.
 */
export function addFeature(feature: GeoJsonFeature): void {
  const source = featureDisplayLayer.getSource()
  if (isVectorSource(source)) {
    source.addFeature(converter.readFeature(feature))
  }
}
