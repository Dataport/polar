import { Modify, Select, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Collection, Feature, MapBrowserEvent } from 'ol'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'

const createModify = (
  rootGetters: PolarActionContext<DrawState, DrawGetters>['rootGetters'],
  drawLayer: CreateInteractionsPayload['drawLayer']
) => {
  let active = false
  const features: Collection<Feature> = new Collection()
  const modify = new Modify({ features })
  modify.on('modifystart', () => {
    active = true
  })
  modify.on('modifyend', () => {
    active = false
  })

  const localSelector = (e: MapBrowserEvent<UIEvent>) => {
    if (!active) {
      rootGetters.map.forEachFeatureAtPixel(
        e.pixel,
        (f) => {
          if (f !== features.item(0)) {
            features.setAt(0, f as Feature)
          }
          return true
        },
        {
          layerFilter: (l) => l === drawLayer,
        }
      )
    }
  }

  rootGetters.map.on('pointermove', localSelector)
  // @ts-expect-error | "un on removal" riding piggyback as _onRemove
  modify._onRemove = () => rootGetters.map.un('pointermove', localSelector)

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
    createModify(rootGetters, drawLayer),
    new Snap({ source: drawSource }),
    select,
  ]
}
