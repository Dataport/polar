import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Interaction from 'ol/interaction/Interaction'
import { DragBox, Select } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'

export default function (
  drawSource: VectorSource,
  drawLayer: VectorLayer
): Interaction[] {
  const selectInteraction = new Select({ layers: [drawLayer] })
  const selectedFeatures = selectInteraction.getFeatures()
  const dragBoxInteraction = new DragBox({
    condition: platformModifierKeyOnly,
  })

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

  // @ts-expect-error | internal hack to detect it in Pins plugin
  selectInteraction._isDeleteSelect = true

  return [selectInteraction, dragBoxInteraction]
}
