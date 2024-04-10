import { Draw, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import VectorSource from 'ol/source/Vector'
import { DrawConfiguration } from '@polar/lib-custom-types'
import { DrawGetters, DrawState } from '../../types'
import { createTextStyle } from '../../utils/createTextStyle'

export default function (
  textInput: DrawState['textInput'],
  textSize: DrawGetters['textSize'],
  drawSource: VectorSource,
  drawConfiguration?: DrawConfiguration
): Interaction[] {
  if (!textInput) {
    // nothing to draw yet
    return []
  }
  const textStyle = createTextStyle(
    textInput,
    drawConfiguration?.textStyle,
    textSize
  )
  const draw = new Draw({
    source: drawSource,
    type: 'Point',
    style: textStyle,
  })
  draw.on('drawend', function (e) {
     e.feature.setStyle(textStyle)
     e.feature.set('text', textInput)
  })
  // prevent the creation of empty text features
  drawSource.on('addfeature', (event) => {
    if (event.feature?.get('text') && !event.feature.get('text').trim()) {
      drawSource.removeFeature(event.feature)
    }
  })
  return [draw, new Snap({ source: drawSource })]
}
