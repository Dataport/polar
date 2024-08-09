import { Draw, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { DrawConfiguration, DrawMode } from '@polar/lib-custom-types'
import VectorSource from 'ol/source/Vector'
import createDrawStyle from '../../utils/createDrawStyle'
import { DrawState } from '../../types'

export default function (
  strokeColor: DrawState['selectedStrokeColor'],
  drawSource: VectorSource,
  drawMode: DrawMode,
  drawConfiguration?: DrawConfiguration
): Interaction[] {
  const style = createDrawStyle(drawConfiguration?.style, drawMode, strokeColor)

  const draw = new Draw({
    source: drawSource,
    type: drawMode,
    style,
  })
  draw.on('drawend', function (e) {
    e.feature.setStyle(style)
    e.feature.set('stroke', strokeColor)
  })
  return [draw, new Snap({ source: drawSource })]
}
