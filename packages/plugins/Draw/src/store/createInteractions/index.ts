import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Draw, Snap } from 'ol/interaction'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import createDrawStyle from '../../utils/createDrawStyle'
import createDeleteInteractions from './createDeleteInteractions'
import createTextInteractions from './createTextInteractions'

export default function (
  {
    dispatch,
    getters: {
      configuration,
      drawMode,
      mode,
      textInput,
      textSize,
      selectedStrokeColor,
    },
  }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] | Promise<Interaction[]> {
  if (mode === 'draw') {
    if (drawMode === 'Text') {
      return createTextInteractions(
        textInput,
        textSize,
        drawSource,
        configuration
      )
    }
    const style = createDrawStyle(
      drawMode,
      selectedStrokeColor,
      configuration?.style
    )

    const draw = new Draw({
      source: drawSource,
      type: drawMode,
      style,
    })
    draw.on('drawend', (e) => e.feature.setStyle(style))

    return [draw, new Snap({ source: drawSource })]
  } else if (mode === 'edit') {
    return dispatch('createModifyInteractions', { drawSource, drawLayer })
  } else if (mode === 'delete') {
    return createDeleteInteractions(drawSource, drawLayer)
  }
  return []
}
