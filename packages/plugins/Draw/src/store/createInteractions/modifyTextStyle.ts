import { PolarActionContext } from '@polar/lib-custom-types'
import { Style } from 'ol/style'
import { DrawGetters, DrawState } from '../../types'

export default function (
  { commit, getters }: PolarActionContext<DrawState, DrawGetters>,
  featureStyle: Style
): void {
  const featureText = featureStyle.getText().getText()
  const font = featureStyle.getText().getFont() as string
  // set selectedSize of feature to prevent unintentional size change
  const fontSize = font.match(/\b\d+(?:.\d+)?/)
  commit('setSelectedSize', getters.fontSizes.indexOf(Number(fontSize)))
  commit('setTextInput', featureText)
}
