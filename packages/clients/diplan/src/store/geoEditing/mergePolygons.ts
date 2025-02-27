import { PolarActionContext } from '@polar/lib-custom-types'
import { DiplanGetters, DiplanState } from '../../types'

export const mergePolygons = ({
  dispatch,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('plugin/draw/setMode', 'none', { root: true })
}
