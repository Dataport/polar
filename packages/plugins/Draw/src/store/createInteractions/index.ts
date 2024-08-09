import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import createDeleteInteractions from './createDeleteInteractions'
import createTextInteractions from './createTextInteractions'
import createDrawInteractions from './createDrawInteractions'

export default function (
  {
    dispatch,
    getters: { drawMode, mode, textInput, textSize, selectedStrokeColor },
    rootGetters: { configuration },
  }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] | Promise<Interaction[]> {
  if (mode === 'draw') {
    if (drawMode === 'Text') {
      return createTextInteractions(
        textInput,
        textSize,
        drawSource,
        configuration.draw
      )
    }
    return createDrawInteractions(
      selectedStrokeColor,
      drawSource,
      drawMode,
      configuration.draw
    )
  } else if (mode === 'edit') {
    return dispatch('createModifyInteractions', { drawSource, drawLayer })
  } else if (mode === 'delete') {
    return createDeleteInteractions(drawSource, drawLayer)
  }
  return []
}
