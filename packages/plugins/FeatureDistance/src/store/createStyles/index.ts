import { PolarActionContext } from '@polar/lib-custom-types'
import { FeatureDistanceGetters, FeatureDistanceState, Mode, StyleParameter } from '../../types'
import { LineString,  MultiPoint,  Polygon } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import createStyle from './createStyle'


export default function (
  { commit, getters }: PolarActionContext<FeatureDistanceState, FeatureDistanceGetters>,
  styleType: Mode | undefined
): Function {
  const parameter: StyleParameter = {color: getters.color, text: getters.textColor, opacity: 0.8, lineWidth: 3, pointWidth: 3};

  if (styleType === 'draw') {
    parameter.opacity = 0.5;
    parameter.pointWidth = 4;
  } else if (styleType === 'edit') {
    parameter.pointWidth = 5;
  } else if (styleType === 'delete') {
    parameter.lineWidth = 4;
    parameter.pointWidth = 5;
  } else if (styleType === 'select') {
    parameter.opacity = 1;
    parameter.lineWidth = 5;
    parameter.pointWidth = 5;
  }
  
  const style = createStyle(parameter);
  const polygonStyle = style[0];
  const lineStyle = style[1];
  const pointStyle = style[2];

  const styleFunc = function (feature) {
    const styles = [polygonStyle, pointStyle];
    const geom = feature.getGeometry() as Polygon | LineString;

    if (geom.getType() !== 'LineString' && geom.getType() !== 'Polygon') {
      return styles;
    }

    let coordinates: Coordinate[] = geom.getType() === 'Polygon' ? 
    (geom as Polygon).getCoordinates()[0] : 
    (geom as LineString).getCoordinates();

    const points = new MultiPoint(coordinates);
    const ps = pointStyle.clone();
    ps.setGeometry(points);
    styles.push(ps);

    for (let i = 1; i < coordinates.length; i++) {
      const l = new LineString([coordinates[i- 1], coordinates[i]]);
      const s = lineStyle.clone();
      s.setGeometry(l);
      const value = getters.getRoundedMeasure(l);
      const text = value + getters.unit;
      s.getText().setText(text);
      styles.push(s);
    }

    geom.set("measure", getters.getRoundedMeasure(geom))
    if (feature === getters.selectedFeature) { commit("setMeasure") }
    
    return styles;
  }
  return styleFunc
}
