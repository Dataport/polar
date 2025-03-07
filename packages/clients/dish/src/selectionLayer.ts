import 'ol/ol.css'
import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import { Style, Fill, Stroke } from 'ol/style'

const selectionLayer = new VectorLayer({
  source: new VectorSource({}),
  style: new Style({
    stroke: new Stroke({
      color: '#FFFF00',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgb(255, 255, 255, 0.3)',
    }),
  }),
})

export default selectionLayer
