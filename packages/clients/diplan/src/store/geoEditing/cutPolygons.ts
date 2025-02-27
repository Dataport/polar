import { PolarActionContext } from '@polar/lib-custom-types'
import Draw from 'ol/interaction/Draw'
import { DiplanGetters, DiplanState } from '../../types'

export const cutPolygons = ({
  dispatch,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('plugin/draw/setMode', 'none', { root: true })

  const draw = new Draw({ type: 'LineString' })

  // TODO draw.on drawend → get draw source, modify polygons

  // TODO get Snap interactions

  dispatch('plugin/draw/setInteractions', [draw], { root: true })
}
