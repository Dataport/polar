import { Feature } from 'geojson'
import { Feature as OlFeature, Map } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import { Vector } from 'ol/source'
import { createEmpty, extend } from 'ol/extent'
import { geoJson, idPrefixes } from '../../../utils/coastalGazetteer/common'
import { FeatureType, TreeViewItem } from '../types'
import { TitleLocationFrequency } from '../../../types'
import { heatStyles, typeToStyle } from './vectorStyles'

const vectorSource = new Vector()
export const vectorLayer = new VectorLayer({
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
    ? features.filter((feature) => feature.getId() === item.id)
    : /* assume item.type === 'text' */ features.filter((feature) =>
        item.children?.map(({ id }) => id).includes(feature.getId() as string)
      )

const featHeat = (
  olFeatures: OlFeature[],
  locationFrequency: TitleLocationFrequency['string']['location_frequency']
) => {
  const max = Math.max(...Object.values(locationFrequency))
  olFeatures.forEach((feature) =>
    feature.set(
      'heat',
      Math.floor((locationFrequency[feature.getId() as string] / max) * 9)
    )
  )
}

export const updateVectorLayer = (
  map: Map,
  features: Feature[],
  item: TreeViewItem | null,
  titleLocationFrequency: TitleLocationFrequency
) => {
  vectorSource.clear()
  const preparedFeatures = features.map((feature) => {
    // Since ol@10, readFeature may also return a Feature[]?
    const olFeature = geoJson.readFeature(feature) as OlFeature
    olFeature.set('featureType', getFeatureType(olFeature))
    return olFeature
  })

  const zoomFeatures = getZoomFeatures(preparedFeatures, item)
  const extent = (zoomFeatures.length ? zoomFeatures : preparedFeatures).reduce(
    (extent, feature) =>
      extend(extent, feature.getGeometry()?.getExtent() || []),
    createEmpty()
  )

  // an extent including Infinity is empty and can't be used by .fit
  if (!extent.includes(Infinity)) {
    map.getView().fit(
      // fall back to global zoom if no high-detail features are found
      extent,
      { padding: [20, 20, 20, 20], duration: 500 }
    )
  }

  preparedFeatures.forEach((feature) => feature.set('heat', undefined))
  if (item?.children?.length && item.type === 'text') {
    featHeat(zoomFeatures, titleLocationFrequency[item.id].location_frequency)
  }

  vectorSource.addFeatures(preparedFeatures)
}
