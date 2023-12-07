import { Feature, Map } from 'ol'
import { createEmpty, extend } from 'ol/extent'

export const resolveClusterClick = (map: Map, feature: Feature) => {
  const features = feature.get('features')

  const extent = createEmpty()
  features.forEach((feature) =>
    extend(extent, feature.getGeometry().getExtent())
  )

  map.getView().fit(extent, {
    duration: 400,
    padding: [80, 30, 80, 30],
  })
}
