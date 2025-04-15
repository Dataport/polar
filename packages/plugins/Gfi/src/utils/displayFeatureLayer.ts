import { Feature as GeoJsonFeature } from 'geojson'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import { Vector } from 'ol/source'

export function getFeatureDisplayLayer() {
  const featureDisplayLayer = new VectorLayer({
    source: new Vector<Feature>({
      features: [],
    }),
  })

  featureDisplayLayer.set('polarInternalId', 'pluginGfiFeatureDisplay')
  featureDisplayLayer.setZIndex(90)
  // NOTE: This may be changed in the future to not use the default styling of @masterportal/masterportalapi
  featureDisplayLayer.set('styleId', 'defaultHighlightFeaturesPoint')

  return featureDisplayLayer
}

function isVectorSource(source): source is Vector {
  return source instanceof Vector
}

/**
 * reset feature layer's features.
 */
export function clear(featureDisplayLayer: VectorLayer): void {
  const source = featureDisplayLayer.getSource()
  if (isVectorSource(source)) {
    source.clear()
  }
}

/**
 * add feature from jsonable GeoJson object.
 */
export function addFeature(
  feature: GeoJsonFeature,
  featureDisplayLayer: VectorLayer
): void {
  const source = featureDisplayLayer.getSource()
  if (isVectorSource(source)) {
    // Since ol@10, readFeature may also return a Feature[]?
    source.addFeature(new GeoJSON().readFeature(feature) as Feature)
  }
}
