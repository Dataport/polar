import { Modify, Select, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'

export default function (
  { commit, dispatch, getters }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] {
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
      dispatch(
        featureStyle && 'getText' in featureStyle && featureStyle.getText()
          ? 'modifyTextStyle'
          : 'modifyDrawStyle',
        featureStyle
      )
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

  const modify = new Modify({ source: drawSource })
  modify.on('modifystart', (event) => {
    // NOTE: This prevents the user from dragging multiple features. Beware, as dragSegments is an internal property, this might break on an update of OpenLayers
    if (event.target.dragSegments_[0]) {
      event.target.dragSegments_ = [event.target.dragSegments_[0]]
    }
  })

  return [modify, new Snap({ source: drawSource }), select]
}
