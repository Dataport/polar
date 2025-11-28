import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'

import { jenfeldCoordinates } from '../jenfeld'

export const id = 'hamburgBorder'

export const addJenfeldBoundary = (map: Map) =>
  map.addLayer(
    new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Polygon(jenfeldCoordinates),
          }),
        ],
      }),
      properties: { id },
    })
  )
