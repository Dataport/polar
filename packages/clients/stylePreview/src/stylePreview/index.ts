import { Map } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { features } from './features'
import { updatePositions } from './updatePositions'
import { updateStyles } from './updateStyles'

export const addStylePreview = (mapInstance) => {
  const map: Map = mapInstance.$store.getters.map

  const source = new VectorSource()
  const layer = new VectorLayer({ source })

  source.addFeatures(Object.values(features))
  map.addLayer(layer)

  map.on('moveend', updatePositions(map, features))
  updatePositions(map, features)()

  mapInstance.updateStyles = updateStyles

  return mapInstance
}
