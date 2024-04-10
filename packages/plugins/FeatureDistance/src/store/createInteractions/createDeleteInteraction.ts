import Interaction from 'ol/interaction/Interaction'
import { Modify, Snap, Select} from 'ol/interaction'
import {never, singleClick} from 'ol/events/condition'
import { LineString, Point } from 'ol/geom'
import { Feature } from 'ol'
import { PolarActionContext } from '@polar/lib-custom-types'
import { FeatureDistanceGetters, FeatureDistanceState } from '../../types'

export default function (
  { dispatch, commit, getters: { lineFeature } }: PolarActionContext<FeatureDistanceState, FeatureDistanceGetters>, 
  {drawSource, drawLayer})
  : Interaction[] {
    
    function removeFeature(feature: Feature) {
      const line = feature.getGeometry() as LineString;
      if (line.getCoordinates().length < 2) {
        drawSource.removeFeature(feature);
        dispatch("setLineFeature", null);
      }
      else if (lineFeature === feature) { commit('setLength') }
      else { dispatch("setLineFeature", feature) }
    }
  
    const modify = new Modify({
      source: drawSource,
      insertVertexCondition: never,
      deleteCondition: singleClick
    })
  
    const select = new Select({ layers: [drawLayer] })
    const snap = new Snap({source: drawSource})
  
    select.on('select', ({selected, mapBrowserEvent}) => {
      if (selected.length > 0) {
        const feature: Feature = selected[0];
        const line = feature.getGeometry() as LineString;
        const point = new Point(mapBrowserEvent.coordinate);
      
        const segment = line.forEachSegment((c1, c2) => {
          const s = new LineString([c1, c2]);
          if (s.intersectsExtent(point.getExtent())) {
            return [c1.toString(), c2.toString()]
          }
        }) as String[] | null
      
        if (segment as String[]) {
          const coords = line.getCoordinates().filter((c) => !segment?.includes(c.toString()))
          line.setCoordinates(coords);
          removeFeature(feature);
          select.getFeatures().clear();
        }
      }
    })
  
    modify.on("modifyend", ({features}) => {
      if (features.getLength() === 1) {
        removeFeature(features.item(0) as Feature);
      }
    })

  return [select, modify, snap];
}
