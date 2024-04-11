import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { FeatureDistanceGetters, FeatureDistanceState } from '../../types'
import { Select, Modify, Draw} from 'ol/interaction'
import {never } from 'ol/events/condition'
import { Style } from 'ol/style'
import { Collection } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

export default async function (
  { 
    dispatch, 
    getters: { mode, selectedFeature, measureMode } 
  } : PolarActionContext<FeatureDistanceState, FeatureDistanceGetters>, 
  drawLayer: VectorLayer<VectorSource>
): Promise<Interaction[]> {  
  let interactions: Interaction[] = [];
  let styleFunc = await dispatch('createStyleFunc');
  const specialStyle = await dispatch('createStyleFunc', mode);
  const drawSource = drawLayer.getSource() as VectorSource;

  if (mode === 'draw') {
    const draw = new Draw({
      style: specialStyle,
      type: measureMode === 'distance' ? 'LineString' : 'Polygon', 
      source: drawSource
    });
  
    draw.on("drawend", ({feature}) => { dispatch("setSelectedFeature", feature) })
  
    interactions.push(draw);
  } 
  else if (drawSource.getFeatures().length > 0) {
    if (mode === 'edit') {
      const modify = new Modify({
        source: drawSource,
        insertVertexCondition: never,
        deleteCondition: never,
        style: new Style()
      });
      
      modify.on('modifystart', ({features}) => dispatch("setSelectedFeature", features.item(0)))
      interactions.push(modify);
      styleFunc = specialStyle;
    }
    else if (mode === 'delete') {
      interactions = await dispatch('createDeleteInteraction', {drawSource, drawLayer});
      styleFunc = specialStyle;
    }
    else {
      const collection = selectedFeature ? new Collection([selectedFeature]) : undefined;
      const select = new Select({
        layers: [drawLayer],
        features: collection,
        style: specialStyle
      });
    
      select.getFeatures().on("add", ({element}) => dispatch("setSelectedFeature", element));
      select.getFeatures().on("remove", () => dispatch("setSelectedFeature", null));
    
      interactions.push(select);
    }
  }
  drawLayer.setStyle(styleFunc);
  return interactions;
}
