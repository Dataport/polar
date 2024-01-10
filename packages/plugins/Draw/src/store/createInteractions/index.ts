import { Draw, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import createDeleteInteractions from './createDeleteInteractions'

export default function (
  { dispatch, getters }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] | Promise<Interaction[]> {
  const { drawMode, mode } = getters
  if (mode === 'draw') {
    if (drawMode === 'Text') {
      return dispatch('createTextInteractions', drawSource)
    }
    return [
      new Draw({ source: drawSource, type: drawMode }),
      new Snap({ source: drawSource }),
    ]
  } else if (mode === 'edit') {
    return dispatch('createModifyInteractions', { drawSource, drawLayer })
  } else if (mode === 'delete') {
    return createDeleteInteractions(drawSource, drawLayer)
  }
  return []
}
