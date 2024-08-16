import { Modify, Select, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import modifyTextInteractions from './modifyTextInteractions'
import modifyDrawInteractions from './modifyDrawInteractions'

export default function (
  state: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] {
  const { commit } = state
  const { getters } = state
  const { drawMode } = getters
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
      commit('setSelectedFeature', lastSelectedFeature)
      const featureStyle = lastSelectedFeature.getStyle()
      if (featureStyle && 'getText' in featureStyle && featureStyle.getText()) {
        modifyTextInteractions(state, featureStyle)
      } else {
        modifyDrawInteractions(state, featureStyle)
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
