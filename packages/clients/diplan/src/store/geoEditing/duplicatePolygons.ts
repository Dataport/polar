import { PolarActionContext } from '@polar/lib-custom-types'
import VectorLayer from 'ol/layer/Vector'
import { Select } from 'ol/interaction'
import { Map } from 'ol'
import { DiplanGetters, DiplanState } from '../../types'

const pointerStyle = (map: Map, drawLayer: VectorLayer) => (e) => {
  const found = map.hasFeatureAtPixel(e.pixel, {
    layerFilter: (l) => l === drawLayer,
  })

  if (found) {
    map.getTargetElement().setAttribute('style', 'cursor: copy')
  } else {
    map.getTargetElement().setAttribute('style', '')
  }
}

export const duplicatePolygons = ({
  dispatch,
  rootGetters,
}: PolarActionContext<DiplanState, DiplanGetters>) => {
  dispatch('updateDrawMode', 'duplicate')

  const drawSource = rootGetters['plugin/draw/drawSource']
  const drawLayer = rootGetters.map
    .getLayers()
    .getArray()
    .find(
      (layer) =>
        layer instanceof VectorLayer && layer.getSource() === drawSource
    ) as VectorLayer
  const selectInteraction = new Select({ layers: [drawLayer] })
  const selectedFeatures = selectInteraction.getFeatures()
  // TODO temp solution, not actually _isDeleteSelect; normalizing these flags is part of a future effort
  // @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
  selectInteraction._isDeleteSelect = true

  const boundPointerStyle = pointerStyle(rootGetters.map, drawLayer)
  rootGetters.map.on('pointermove', boundPointerStyle)

  selectedFeatures.on(['add'], () => {
    drawSource.addFeature(selectedFeatures.getArray()[0].clone())
    selectedFeatures.clear()
    dispatch('updateDrawMode', null)
  })

  // @ts-expect-error | local piggyback
  selectInteraction._onRemove = () => {
    rootGetters.map.un('pointermove', boundPointerStyle)
    rootGetters.map.getTargetElement().setAttribute('style', '')
  }

  dispatch('plugin/draw/setInteractions', [selectInteraction], { root: true })
}
