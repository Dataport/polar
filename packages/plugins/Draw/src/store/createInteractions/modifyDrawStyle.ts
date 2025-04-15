import { PolarActionContext } from '@polar/lib-custom-types'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'
import { Style } from 'ol/style'
import { DrawGetters, DrawState } from '../../types'

export default function (
  { commit }: PolarActionContext<DrawState, DrawGetters>,
  featureStyle: Style
): void {
  let strokeColor: Color | ColorLike
  if (featureStyle && 'getImage' in featureStyle && featureStyle.getImage()) {
    // @ts-expect-error | For some reason getStroke is not defined on the type but is callable.
    strokeColor = featureStyle.getImage().getStroke().getColor()
  } else {
    strokeColor = featureStyle.getStroke()?.getColor() || 'black'
  }
  commit('setSelectedStrokeColor', strokeColor)
}
