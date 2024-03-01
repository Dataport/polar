import { Feature } from 'geojson'
import { Feature as OlFeature, Map } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import { Vector } from 'ol/source'
import { createEmpty, extend } from 'ol/extent'
import { geoJson, idPrefixes } from '../../../utils/coastalGazetteer/common'
import { FeatureType, TreeViewItem } from '../types'
import { heatStyles, typeToStyle } from './vectorStyles'

const vectorSource = new Vector()
export const vectorLayer = new VectorLayer<Vector>({
  source: vectorSource,
  style: (feature) =>
    heatStyles[feature.get('heat')] || typeToStyle[feature.get('featureType')],
  properties: { name: 'textLocator' },
})

const getFeatureType = (feature: OlFeature): FeatureType => {
  const id = `${feature.getId()}`
  if (id === 'undefined') return 'fallback'
  // idPrefixes.country is sorted out upon arrival
  if (id.startsWith(idPrefixes.regionRough)) return 'roughBackground'
  if (id.startsWith(idPrefixes.regionFine)) return 'fineBackground'
  if (id.startsWith(idPrefixes.wattenmeer)) return 'wattenmeer'
  return 'detail'
}

const getZoomFeatures = (features: OlFeature[], item: TreeViewItem | null) =>
  item === null
    ? features.filter((feature) => feature.get('featureType') === 'detail')
    : item.type === 'toponym'
    ? features.filter(
        // TODO once items feature actual IDs, change this title comparison
        (feature) => feature.get('title') === item.id
      )
    : /* assume item.type === 'text' */ features.filter(
        // TODO once items feature actual IDs, change this title comparison
        // TODO naïve – will only find primary names
        (feature) =>
          item.children?.map(({ id }) => id).includes(feature.get('title'))
      )

export const updateVectorLayer = (
  map: Map,
  features: Feature[],
  item: TreeViewItem | null
) => {
  console.warn('features', features)
  console.warn('item', item)
  vectorSource.clear()
  const preparedFeatures = features.map((feature) => {
    const olFeature = geoJson.readFeature(feature)
    olFeature.set('featureType', getFeatureType(olFeature))
    return olFeature
  })

  const zoomFeatures = getZoomFeatures(preparedFeatures, item)
  if (zoomFeatures.length) {
    map.getView().fit(
      zoomFeatures.reduce(
        (extent, feature) =>
          extend(extent, feature.getGeometry()?.getExtent() || []),
        createEmpty()
      ),
      { padding: [20, 20, 20, 20], duration: 500 }
    )
  }
  // TODO style by dominance: feature.set('heat', 0-9)
  // only consider item for heat, if not null
  vectorSource.addFeatures(preparedFeatures)
}
