import { PolarActionContext } from '@polar/lib-custom-types'
import { Style } from 'ol/style'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'
import { DrawGetters, DrawState } from '../../types'

export default function (
  { commit }: PolarActionContext<DrawState, DrawGetters>,
  featureStyle: Style
): void {
  let strokeColor: Color | ColorLike
  if (featureStyle && 'getImage' in featureStyle && featureStyle.getImage()) {
    strokeColor = featureStyle.getImage().getStroke().getColor()
  } else {
    strokeColor = featureStyle.getStroke().getColor()
  }
  commit('setSelectedStrokeColor', strokeColor)
}
