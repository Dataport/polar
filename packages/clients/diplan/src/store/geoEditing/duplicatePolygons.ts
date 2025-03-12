import { PolarActionContext } from '@polar/lib-custom-types'
import { DiplanGetters, DiplanState } from '../../types'

export const duplicatePolygons = ({
  commit,
  dispatch,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('plugin/draw/setMode', 'none', { root: true })
  commit('setDrawMode', 'duplicate')

  dispatch(
    'plugin/toast/addToast',
    {
      type: 'info',
      text: 'Duplicate not yet implemented.',
      timeout: 3000,
    },
    { root: true }
  )

  // TODO on end: commit('setDrawMode', null)
}
