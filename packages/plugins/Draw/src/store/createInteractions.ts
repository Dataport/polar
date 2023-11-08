import VectorSource from 'ol/source/Vector'
import { DragBox, Draw, Modify, Select, Snap } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'
import VectorLayer from 'ol/layer/Vector'
import Geometry from 'ol/geom/Geometry'
import { createTextStyle } from '../utils/createTextStyle'

export default function (
  {
    commit,
    getters: { mode, drawMode, textInput, fontSizes },
    rootGetters: { configuration },
    textSize,
  },
  drawSource: VectorSource,
  drawLayer: VectorLayer<VectorSource<Geometry>>
) {
  if (mode === 'draw') {
    if (drawMode === 'Text') {
      if (!textInput) {
        // nothing to draw yet
        return []
      }
      const textStyle = createTextStyle(
        textInput,
        configuration?.draw?.textStyle,
        textSize
      )
      const draw = new Draw({
        source: drawSource,
        type: 'Point',
        style: textStyle,
      })
      draw.on('drawend', function (e) {
        e.feature.setStyle(textStyle)
        e.feature.set('text', textInput)
      })
      // prevent the creation of empty text features
      drawSource.on('addfeature', (event) => {
        if (event.feature?.get('text') && !event.feature.get('text').trim()) {
          drawSource.removeFeature(event.feature)
        }
      })
      return [draw, new Snap({ source: drawSource })]
    }
    return [
      new Draw({ source: drawSource, type: drawMode }),
      new Snap({ source: drawSource }),
    ]
  } else if (mode === 'edit') {
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
  } else if (mode === 'delete') {
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

    return [selectInteraction, dragBoxInteraction]
  }
  return []
}
