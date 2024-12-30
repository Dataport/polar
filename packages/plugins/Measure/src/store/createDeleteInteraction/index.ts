import { Modify, Interaction } from 'ol/interaction'
import { never, singleClick } from 'ol/events/condition'
import { LineString, Polygon } from 'ol/geom'
import { Feature } from 'ol'
import { PolarActionContext } from '@polar/lib-custom-types'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { MeasureGetters, MeasureState } from '../../types'

// gets the outer Line as an LineString
function getLine(feature: Feature): LineString {
  const geometry = feature.getGeometry() as LineString | Polygon
  return new LineString(
    geometry.getType() === 'Polygon'
      ? (geometry as Polygon).getCoordinates()[0]
      : (geometry as LineString).getCoordinates()
  )
}

export function removeFeature(
  {
    dispatch,
    commit,
    getters: { selectedFeature },
  }: PolarActionContext<MeasureState, MeasureGetters>,
  {
    feature,
    pointAmount,
    drawSource,
  }: { feature: Feature; pointAmount: number; drawSource: VectorSource }
) {
  const minimum =
    (feature.getGeometry() as LineString | Polygon).getType() === 'Polygon'
      ? 4
      : 3
  if (pointAmount < minimum) {
    drawSource.removeFeature(feature)
    dispatch('setSelectedFeature', null)
    return
  }
  if (selectedFeature === feature) {
    commit('setMeasure')
  } else {
    dispatch('setSelectedFeature', feature)
  }
}

/**
 * Creates the modify interaction necessary to delete corners of the drawn features.
 */
export function createDeleteInteraction(
  { dispatch }: PolarActionContext<MeasureState, MeasureGetters>,
  drawLayer: VectorLayer<Feature>
): Interaction[] {
  const drawSource = drawLayer.getSource() as VectorSource
  const modify = new Modify({
    source: drawSource,
    insertVertexCondition: never,
    deleteCondition: singleClick,
  })
  modify.on('modifystart', ({ features }) => {
    if (features.getLength() === 1) {
      const feature = features.item(0) as Feature
      const line = getLine(feature)
      dispatch('removeFeature', {
        feature,
        pointAmount: line.getCoordinates().length,
        drawSource,
      })
    }
  })
  return [modify]
}
