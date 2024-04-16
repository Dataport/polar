import { PolarActionContext } from '@polar/lib-custom-types'
import { MeasureGetters, MeasureState, Mode, StyleParameter } from '../../types'
import { LineString,  MultiPoint,  Polygon } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'
import createStyle from './createStyle'


export default function (
  { commit, getters }: PolarActionContext<MeasureState, MeasureGetters>,
  styleType: Mode | undefined
): Function {
  // Standard Style
  const parameter: StyleParameter = {color: getters.color, text: getters.textColor, opacity: 0.8, lineWidth: 3, pointWidth: 3};

  if (styleType === 'draw') {
    // lower opacity and slightly larger points
    parameter.opacity = 0.5;
    parameter.pointWidth = 4;
  } else if (styleType === 'edit') {
    // larger points for easier movement
    parameter.pointWidth = 5;
  } else if (styleType === 'delete') {
    // larger lines and points
    parameter.lineWidth = 4;
    parameter.pointWidth = 5;
  } else if (styleType === 'select') {
    // higher opacity with thicker lines and bigger points
    parameter.opacity = 1;
    parameter.lineWidth = 5;
    parameter.pointWidth = 5;
  }
  
  const style = createStyle(parameter);
  const polygonStyle = style[0];
  const lineStyle = style[1];
  const pointStyle = style[2];

  // set corner-points and text
  const styleFunc = function (feature) {
    // setting only polygon and point as standard
    const styles = [polygonStyle, pointStyle];
    const geom = feature.getGeometry() as Polygon | LineString;

    if (geom.getType() !== 'LineString' && geom.getType() !== 'Polygon') {
      return styles;
    }

    let coordinates: Coordinate[] = geom.getType() === 'Polygon' ? 
    (geom as Polygon).getCoordinates()[0] : 
    (geom as LineString).getCoordinates();

    // sets points at the corners/coordinates
    const points = new MultiPoint(coordinates);
    const ps = pointStyle.clone();
    ps.setGeometry(points);
    styles.push(ps);

    // takes the parts between two coordinates and calculates the partial distance
    for (let i = 1; i < coordinates.length; i++) {
      const l = new LineString([coordinates[i- 1], coordinates[i]]);
      const s = lineStyle.clone();
      s.setGeometry(l);
      const value = getters.getRoundedMeasure(l);
      const text = value + getters.unit;
      s.getText().setText(text);
      styles.push(s);
    }

    // updates the measured value of complete Length/Area, when Line/Polygon is selected
    geom.set("measure", getters.getRoundedMeasure(geom))
    if (feature === getters.selectedFeature) { commit("setMeasure") }
    
    return styles;
  }
  return styleFunc
}
