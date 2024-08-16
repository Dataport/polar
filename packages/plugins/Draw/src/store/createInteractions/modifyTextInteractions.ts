import { PolarActionContext } from '@polar/lib-custom-types'
import { DrawGetters, DrawState } from '../../types'

export default function (
  { commit, getters }: PolarActionContext<DrawState, DrawGetters>,
  featureStyle
): void {
  const featureText = featureStyle.getText().getText()
  const font = featureStyle.getText().getFont()
  // set selectedSize of feature to prevent unintentional size change
  const fontSize = font.match(/\b\d+(?:.\d+)?/)
  commit('setSelectedSize', getters.fontSizes.indexOf(Number(fontSize)))
  commit('setTextInput', featureText)
}
