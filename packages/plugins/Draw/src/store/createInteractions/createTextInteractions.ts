import { Draw, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import VectorSource from 'ol/source/Vector'
import { PolarActionContext } from '@polar/lib-custom-types'
import { DrawGetters, DrawState } from '../../types'
import { createTextStyle } from '../../utils/createTextStyle'

export default function (
  {
    getters: { textInput, textSize },
    rootGetters: { configuration },
  }: PolarActionContext<DrawState, DrawGetters>,
  drawSource: VectorSource
): Interaction[] {
  if (!textInput) {
    // nothing to draw yet
    return []
  }
  const textStyle = createTextStyle(
    textInput,
    configuration?.draw?.textStyle,
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
