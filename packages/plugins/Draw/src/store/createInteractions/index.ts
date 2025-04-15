import { PolarActionContext } from '@polar/lib-custom-types'
import Interaction from 'ol/interaction/Interaction'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'

export default function (
  { dispatch, getters: { mode } }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] | Promise<Interaction[]> {
  if (mode === 'draw') {
    return dispatch('createDrawInteractions', { drawSource })
  } else if (mode === 'edit') {
    return dispatch('createModifyInteractions', { drawSource, drawLayer })
  } else if (mode === 'translate') {
    return dispatch('createTranslateInteractions', { drawSource, drawLayer })
  } else if (mode === 'delete') {
    return dispatch('createDeleteInteractions', { drawSource, drawLayer })
  } else if (mode === 'lasso') {
    return dispatch('createLassoInteractions')
  } else if (mode === 'duplicate') {
    return dispatch('createDuplicateInteractions', { drawSource, drawLayer })
  } else if (mode === 'cut') {
    return dispatch('createCutInteractions', { drawSource })
  } else if (mode === 'merge') {
    return dispatch('createMergeInteractions', { drawSource })
  }
  return []
}
