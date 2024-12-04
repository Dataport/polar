import Interaction from 'ol/interaction/Interaction'
import { Modify, Snap, Select } from 'ol/interaction'
import { never, singleClick } from 'ol/events/condition'
import { LineString, Point, Polygon } from 'ol/geom'
import { Feature, MapBrowserEvent } from 'ol'
import { PolarActionContext } from '@polar/lib-custom-types'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { MeasureGetters, MeasureState } from '../types'

// gets the outer Line as an LineString
function getLine(feature: Feature): LineString {
  const geom = feature.getGeometry() as LineString | Polygon
  const coords =
    geom.getType() === 'Polygon'
      ? (geom as Polygon).getCoordinates()[0]
      : (geom as LineString).getCoordinates()
  return new LineString(coords)
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
): boolean {
  const geom = feature.getGeometry() as LineString | Polygon
  const minimum = geom.getType() === 'Polygon' ? 3 : 2
  if (pointAmount < minimum) {
    drawSource.removeFeature(feature)
    dispatch('setSelectedFeature', null)
    return true
  }
  if (selectedFeature === feature) {
    commit('setMeasure')
  } else {
    dispatch('setSelectedFeature', feature)
  }
  return false
}

interface OnSelectPayload {
  selected: Feature[]
  // NOTE that's how OL types it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapBrowserEvent: MapBrowserEvent<any>
  drawSource: VectorSource
  select: Select
}

export function onSelect(
  { dispatch }: PolarActionContext<MeasureState, MeasureGetters>,
  { selected, mapBrowserEvent, drawSource, select }: OnSelectPayload
) {
  if (selected.length > 0) {
    // gets the feature, outline and clicked point
    const feature: Feature = selected[0]
    const line = getLine(feature)
    const point = new Point(mapBrowserEvent.coordinate)
    // goes through the line-parts, return the coordinates of the clicked parts as String
    const segment = line.forEachSegment((c1, c2) => {
      const s = new LineString([c1, c2])
      if (s.intersectsExtent(point.getExtent())) {
        return [c1.toString(), c2.toString()]
      }
    }) as string[] | null
    if (segment as string[]) {
      // removes the coordinates for the clicked line
      const newCoords = line
        .getCoordinates()
        .filter((c) => !segment?.includes(c.toString()))
      line.setCoordinates(newCoords)
      const coords = line.getCoordinates()
      if (
        !dispatch('removeFeature', {
          feature,
          pointAmount: coords.length,
          drawSource,
        })
      ) {
        // resets the coordinates and redraws if the feature still exists
        const geom = feature.getGeometry() as LineString | Polygon
        if (geom.getType() === 'LineString') {
          ;(geom as LineString).setCoordinates(coords)
        } else {
          coords.push(coords[0])
          ;(geom as Polygon).setCoordinates([coords])
        }
      }
      select.getFeatures().clear()
    }
  }
}

/**
 * Creates the interactions necessary to delete points or vertices of the drawn features.
 * @param context - ActionContext to have access to dispatch, commit and getters
 * @param drawLayer - drawing layer
 * @returns Array with the created Interactions
 */
export function createDeleteInteraction(
  { dispatch }: PolarActionContext<MeasureState, MeasureGetters>,
  drawLayer: VectorLayer<Feature>
): Interaction[] {
  // checks if Feature has still enough points
  // deletes if not
  // returns if feature got deleted
  const drawSource = drawLayer.getSource() as VectorSource

  // modify for deleting points
  const modify = new Modify({
    source: drawSource,
    insertVertexCondition: never,
    deleteCondition: singleClick,
  })
  // select for deleting vertices
  const select = new Select({ layers: [drawLayer] })
  const snap = new Snap({ source: drawSource })

  // removes vertices
  select.on('select', ({ selected, mapBrowserEvent }) =>
    dispatch('onSelect', { selected, mapBrowserEvent, drawSource, select })
  )

  // removes point
  modify.on('modifyend', ({ features }) => {
    if (features.getLength() === 1) {
      const feature = features.item(0) as Feature
      const line = getLine(feature)
      dispatch('removeFeature', {
        feature,
        pointAmount: line.getCoordinates().length - 1,
        drawSource,
      })
    }
  })

  return [select, modify, snap]
}
