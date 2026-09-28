import { PolarActionContext } from '@polar/lib-custom-types'
import { Map } from 'ol'
import { Select } from 'ol/interaction'
import { Vector } from 'ol/layer'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'

const pointerStyle = (map: Map, drawLayer: Vector) => (e) => {
  const found = map.hasFeatureAtPixel(e.pixel, {
    layerFilter: (l) => l === drawLayer,
  })

  if (found) {
    map.getTargetElement().setAttribute('style', 'cursor: copy')
  } else {
    map.getTargetElement().setAttribute('style', '')
  }
}

export function createDuplicateInteractions(
  { rootGetters }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
) {
  const selectInteraction = new Select({ layers: [drawLayer], style: null })
  const selectedFeatures = selectInteraction.getFeatures()
  // TODO temp solution, not actually _isDeleteSelect; normalizing these flags is part of a future effort
  // @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
  selectInteraction._isDeleteSelect = true

  const boundPointerStyle = pointerStyle(rootGetters.map, drawLayer)
  rootGetters.map.on('pointermove', boundPointerStyle)

  selectedFeatures.on('add', () => {
    drawSource.addFeature(selectedFeatures.getArray()[0].clone())
    selectedFeatures.clear()
  })

  // @ts-expect-error | local piggyback
  selectInteraction._onRemove = () => {
    rootGetters.map.un('pointermove', boundPointerStyle)
    rootGetters.map.getTargetElement().setAttribute('style', '')
  }

  return [selectInteraction]
}
