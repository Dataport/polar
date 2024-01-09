import { Modify, Select, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../types'

export default function (
  { commit, getters }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] {
  const { drawMode, fontSizes } = getters
  // clear input - no feature selected initially
  commit('setTextInput', '')
  const select = new Select({
    layers: [drawLayer],
    style: null,
    hitTolerance: 50,
  })
  let lastSelectedFeature
  select.on('select', (event) => {
    if (event.selected.length > 0) {
      lastSelectedFeature = event.selected[event.selected.length - 1]
      const featureStyle = lastSelectedFeature.getStyle()
      if (featureStyle && 'getText' in featureStyle) {
        const featureText = featureStyle.getText().getText()
        const font = featureStyle.getText().getFont()
        // set selectedSize of feature to prevent unintentional size change
        const fontSize = font.match(/\b\d+(?:.\d+)?/)
        commit('setSelectedSize', fontSizes.indexOf(Number(fontSize)))
        commit('setTextInput', featureText)
        commit('setSelectedFeature', lastSelectedFeature)
      }
    } else if (event.selected.length === 0) {
      if (lastSelectedFeature && lastSelectedFeature.get('text') === '') {
        drawSource.removeFeature(lastSelectedFeature)
        commit('updateFeatures')
      }
      if (drawMode === 'Text') {
        commit('setTextInput', '')
        commit('setSelectedFeature', null)
      }
    }
  })
  return [
    new Modify({ source: drawSource }),
    new Snap({ source: drawSource }),
    select,
  ]
}
