import { PolarActionContext } from '@polar/lib-custom-types'
import { DiplanGetters, DiplanState } from '../../types'

export const duplicatePolygons = ({
  dispatch,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('plugin/draw/setMode', 'none', { root: true })
}
