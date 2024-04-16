import Interaction from 'ol/interaction/Interaction'
import { Modify, Snap, Select} from 'ol/interaction'
import {never, singleClick} from 'ol/events/condition'
import { LineString, Point, Polygon } from 'ol/geom'
import { Feature } from 'ol'
import { PolarActionContext } from '@polar/lib-custom-types'
import { MeasureGetters, MeasureState } from '../../types'

export default function (
  { dispatch, commit, getters: { selectedFeature } }: PolarActionContext<MeasureState, MeasureGetters>, 
  {drawSource, drawLayer})
  : Interaction[] {
    
    // checks if Feature has still enough points
    // deletes if not
    // returns if feature got deleted
    function removeFeature(feature: Feature, pointAmount: number) : boolean {
      const geom = feature.getGeometry() as LineString | Polygon;
      const minimum = geom.getType() === 'Polygon' ? 3 : 2;
      if (pointAmount < minimum) {
        drawSource.removeFeature(feature);
        dispatch("setSelectedFeature", null);
        return true;
      }
      if (selectedFeature === feature) { commit('setMeasure') }
      else { dispatch("setSelectedFeature", feature) }
      return false;
    }

    // gets the outer Line as an LineString
    function getLine(feature: Feature) : LineString {
        const geom = feature.getGeometry() as LineString | Polygon;
        const coords = geom.getType() === 'Polygon' ? (geom as Polygon).getCoordinates()[0] : (geom as LineString).getCoordinates();
        return new LineString(coords);
    }

    // modify for deleting points
    const modify = new Modify({
      source: drawSource,
      insertVertexCondition: never,
      deleteCondition: singleClick
    })
    // select for deleting vertebrae
    const select = new Select({ layers: [drawLayer] })
    const snap = new Snap({source: drawSource})
  
    select.on('select', ({selected, mapBrowserEvent}) => {
      if (selected.length > 0) {
        // gets the feature, outline and clicked point
        const feature: Feature = selected[0];
        const line = getLine(feature);
        const point = new Point(mapBrowserEvent.coordinate);
      
        // goes through the line-parts, return the coordinates of the clicked parts as String
        const segment = line.forEachSegment((c1, c2) => {
          const s = new LineString([c1, c2]);
          if (s.intersectsExtent(point.getExtent())) {
            return [c1.toString(), c2.toString()]
          }
        }) as String[] | null
      
        if (segment as String[]) {
          // removes the coordinates for the clicked line
          const newCoords = line.getCoordinates().filter((c) => !segment?.includes(c.toString()))
          line.setCoordinates(newCoords);
          const coords = line.getCoordinates();

          if (!removeFeature(feature, coords.length)) {
            // resets the coordinates and redraws if the feature still exists
            const geom = feature.getGeometry() as LineString | Polygon;
            if (geom.getType() === 'LineString') { 
              (geom as LineString).setCoordinates(coords);
            }
            else {
              coords.push(coords[0]);
              (geom as Polygon).setCoordinates([coords]);
            }
          }

          select.getFeatures().clear();
        }
      }
    })
  
    modify.on("modifyend", ({features}) => {
      if (features.getLength() === 1) {
        const feature = features.item(0) as Feature;
        const line =  getLine(feature);
        removeFeature(feature, (line.getCoordinates().length - 1))
      }
    })

  return [select, modify, snap];
}
