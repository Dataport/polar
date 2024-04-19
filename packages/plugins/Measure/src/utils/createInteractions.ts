import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Select, Modify, Draw } from 'ol/interaction'
import { never } from 'ol/events/condition'
import { Style } from 'ol/style'
import { Collection } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { MeasureGetters, MeasureState } from '../types'

/**
 * Creates Interactions to interact with the drawing layer depending on the tool mode
 * @param context - ActionContext to have access to dispatch and getters
 * @param drawLayer - drawing layer
 * @returns Array with the created Interactions
 */
export default async function (
  {
    dispatch,
    getters: { mode, selectedFeature, measureMode },
  }: PolarActionContext<MeasureState, MeasureGetters>,
  drawLayer: VectorLayer<VectorSource>
): Promise<Interaction[]> {
  let interactions: Interaction[] = []
  let styleFunc = await dispatch('createStyleFunc')
  const specialStyle = await dispatch('createStyleFunc', mode)
  const drawSource = drawLayer.getSource() as VectorSource

  if (mode === 'draw') {
    // draws Lines or Polygon depending on mode
    const draw = new Draw({
      style: specialStyle,
      type: measureMode === 'distance' ? 'LineString' : 'Polygon',
      source: drawSource,
    })

    draw.on('drawend', ({ feature }) => {
      dispatch('setSelectedFeature', feature)
    })

    interactions.push(draw)
  } else if (drawSource.getFeatures().length > 0) {
    if (mode === 'edit') {
      // edits only the corner-points
      const modify = new Modify({
        source: drawSource,
        insertVertexCondition: never,
        deleteCondition: never,
        style: new Style(),
      })

      // selects edited feature
      modify.on('modifystart', ({ features }) =>
        dispatch('setSelectedFeature', features.item(0))
      )
      interactions.push(modify)
      styleFunc = specialStyle
    } else if (mode === 'delete') {
      interactions = await dispatch('createDeleteInteraction', drawLayer)
      styleFunc = specialStyle
    } else {
      // presets select if feature is selected
      const collection = selectedFeature
        ? new Collection([selectedFeature])
        : undefined
      const select = new Select({
        layers: [drawLayer],
        features: collection,
        style: specialStyle,
      })

      // selects and deselects
      select
        .getFeatures()
        .on('add', ({ element }) => dispatch('setSelectedFeature', element))
      select
        .getFeatures()
        .on('remove', () => dispatch('setSelectedFeature', null))

      interactions.push(select)
    }
  }
  drawLayer.setStyle(styleFunc)
  return interactions
}
