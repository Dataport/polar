import { Modify, Select, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Collection, Feature, Map } from 'ol'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import { makeLocalSelector } from './localSelector'
import { getSchnaps } from './getSnaps'

const createModify = (
  map: Map,
  drawLayer: CreateInteractionsPayload['drawLayer']
) => {
  const activeContainer = { active: false }
  const features: Collection<Feature> = new Collection()
  const modify = new Modify({ features })
  modify.set('_isPolarDragLikeInteraction', true, true)
  modify.on('modifystart', () => {
    activeContainer.active = true
  })
  modify.on('modifyend', () => {
    activeContainer.active = false
  })

  const localSelector = makeLocalSelector(
    map,
    activeContainer,
    features,
    drawLayer
  )
  map.on('pointermove', localSelector)
  // @ts-expect-error | "un on removal" riding piggyback as _onRemove
  modify._onRemove = () => map.un('pointermove', localSelector)

  return modify
}

export default function (
  {
    commit,
    dispatch,
    getters,
    rootGetters,
  }: PolarActionContext<DrawState, DrawGetters>,
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
  return [
    createModify(rootGetters.map, drawLayer),
    ...getSchnaps(
      rootGetters.map,
      rootGetters.configuration?.draw?.snapTo || []
    ),
    new Snap({ source: drawSource }),
    select,
  ]
}
