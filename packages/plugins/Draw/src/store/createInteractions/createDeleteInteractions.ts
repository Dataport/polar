import VectorLayer from 'ol/layer/Vector'
import Interaction from 'ol/interaction/Interaction'
import { DragBox, Select } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Map } from 'ol'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'

const pointerStyle = (map: Map, drawLayer: VectorLayer) => (e) => {
  const found = map.forEachFeatureAtPixel(e.pixel, () => true, {
    layerFilter: (l) => l === drawLayer,
  })

  if (found) {
    map.getTargetElement().setAttribute('style', 'cursor: pointer')
  } else {
    map.getTargetElement().setAttribute('style', '')
  }
}

export default function (
  { rootGetters }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] {
  const selectInteraction = new Select({ layers: [drawLayer] })
  const selectedFeatures = selectInteraction.getFeatures()
  const dragBoxInteraction = new DragBox({
    condition: platformModifierKeyOnly,
  })

  const boundPointerStyle = pointerStyle(rootGetters.map, drawLayer)
  rootGetters.map.on('pointermove', boundPointerStyle)

  dragBoxInteraction.on('boxend', () => {
    const extent = dragBoxInteraction.getGeometry().getExtent()
    selectedFeatures.extend(
      drawSource
        .getFeaturesInExtent(extent)
        .filter((feature) => feature.getGeometry()?.intersectsExtent(extent))
    )
  })

  selectedFeatures.on(['add'], () => {
    selectedFeatures.forEach((feature) => drawSource.removeFeature(feature))
    selectedFeatures.clear()
  })

  // @ts-expect-error | internal hack to detect it in other plugins
  selectInteraction._isDeleteSelect = true

  // @ts-expect-error | local piggyback
  selectInteraction._onRemove = () => {
    rootGetters.map.un('pointermove', boundPointerStyle)
    rootGetters.map.getTargetElement().setAttribute('style', '')
  }

  return [selectInteraction, dragBoxInteraction]
}
