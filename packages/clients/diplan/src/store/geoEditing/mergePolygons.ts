import { PolarActionContext } from '@polar/lib-custom-types'
import { DiplanGetters, DiplanState } from '../../types'

export const mergePolygons = ({
  commit,
  dispatch,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('plugin/draw/setMode', 'none', { root: true })
  commit('setDrawMode', 'merge')

  dispatch(
    'plugin/toast/addToast',
    {
      type: 'info',
      text: 'Merge not yet implemented.',
      timeout: 3000,
    },
    { root: true }
  )

  // TODO on end: commit('setDrawMode', null)
}
