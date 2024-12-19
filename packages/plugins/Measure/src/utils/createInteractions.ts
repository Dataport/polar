import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Select, Modify, Draw } from 'ol/interaction'
import { never } from 'ol/events/condition'
import { Style } from 'ol/style'
import { Collection, Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { StyleLike } from 'ol/style/Style'
import { MeasureGetters, MeasureState } from '../types'

const getDraw = (source: VectorSource, measureMode: string, style: StyleLike) =>
  new Draw({
    style,
    type: measureMode === 'distance' ? 'LineString' : 'Polygon',
    source,
  })

const getModify = (source: VectorSource) =>
  new Modify({
    source,
    insertVertexCondition: never,
    deleteCondition: never,
    style: new Style(),
  })

const getSelect = (
  drawLayer: VectorLayer<Feature>,
  selectedFeature: Feature | null,
  specialStyle: StyleLike
) =>
  new Select({
    layers: [drawLayer],
    // presets select if feature is selected
    features: selectedFeature ? new Collection([selectedFeature]) : undefined,
    style: specialStyle,
  })

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
  drawLayer: VectorLayer<Feature>
): Promise<Interaction[]> {
  let interactions: Interaction[] = []
  let styleFunc = await dispatch('createStyleFunc')
  const specialStyle: StyleLike = await dispatch('createStyleFunc', mode)
  const drawSource = drawLayer.getSource() as VectorSource

  if (mode === 'draw') {
    const draw = getDraw(drawSource, measureMode, specialStyle)
    draw.on('drawend', ({ feature }) => dispatch('setSelectedFeature', feature))
    interactions.push(draw)
  } else if (drawSource.getFeatures().length > 0) {
    if (mode === 'edit') {
      const modify = getModify(drawSource)
      modify.on('modifystart', ({ features }) =>
        dispatch('setSelectedFeature', features.item(0))
      )
      interactions.push(modify)
      styleFunc = specialStyle
    } else if (mode === 'delete') {
      interactions = await dispatch('createDeleteInteraction', drawLayer)
      styleFunc = specialStyle
    } else {
      const select = getSelect(drawLayer, selectedFeature, specialStyle)
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
