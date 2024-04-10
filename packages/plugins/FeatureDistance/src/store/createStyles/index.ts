import { PolarActionContext } from '@polar/lib-custom-types'
import { FeatureDistanceGetters, FeatureDistanceState, Mode } from '../../types'
import { Text, Fill, Stroke, Circle, Style } from 'ol/style'
import { LineString,  Point } from 'ol/geom'
import createDrawStyle from './createDrawStyle'
import createDeleteStyle from './createDeleteStyle'
import createModifyStyle from './createModifyStyle'
import createSelectStyle from './createSelectStyle'


export default function (
  { commit, getters }: PolarActionContext<FeatureDistanceState, FeatureDistanceGetters>,
  styleType: Mode | undefined
): Function {
  const {r, g, b} = getters.color;
  const textColor = getters.textColor;
  const pointStyle = new Style({
    image: new Circle({
      radius: 3,
      stroke: new Stroke({
        color: [r, g, b, 1.0],
        width: 1
      }),
      fill: new Fill({
        color: [r, g, b, 0.4]
      })
    }),
  });
  
  const lineStyle = new Style({
    stroke: new Stroke({
      color: [r, g, b, 0.8],
      width: 3
    }),
    text: new Text({
      font: 'bold 10px cursive',
      placement: 'line',
      fill: new Fill({
        color: [textColor.r, textColor.g, textColor.b, 0.8]
      }),
      stroke: new Stroke({
        color: [r, g, b, 0.8]
      }),
      offsetY: -5,
    })
  });
  let style: Style[] = [pointStyle, lineStyle];
  
  if (styleType === 'draw') {
    style = createDrawStyle(getters.color, textColor);
  } else if (styleType === 'edit') {
    style = createModifyStyle(getters.color, textColor);
  } else if (styleType === 'delete') {
    style = createDeleteStyle(getters.color, textColor);
  } else if (styleType === 'select') {
    style = createSelectStyle(getters.color, textColor);
  }
  
  const pointstyle = style[0];
  const linestyle = style[1];

  const styleFunc = function (feature) {
    const styles: Style[] = [];
    if (feature.getGeometry().getType() === 'Point') {
      const dot = feature.getGeometry() as Point;
      const dotStyle = pointstyle.clone();
      dotStyle.setGeometry(dot);
      styles.push(dotStyle);
    }
    else {
    const line = feature.getGeometry() as LineString;
    line.forEachSegment((c1, c2) => {
      const segment = new LineString([c1, c2]);
      const length = getters.getRoundedLength(segment);
      const text = length + getters.unit;
      const segmentstyle = linestyle.clone();
      segmentstyle.getText().setText(text);
      segmentstyle.setGeometry(segment);
      const point = new Point(c1);
      const c1style = pointstyle.clone();
      c1style.setGeometry(point);
      styles.splice(styles.length, 0, segmentstyle, c1style)
      if (c2.toString() === line.getLastCoordinate().toString()) {
        const endpoint = new Point(c2);
        const c2style = pointstyle.clone();
        c2style.setGeometry(endpoint);
        styles.push(c2style);
      }
    })
    line.set("length", getters.getRoundedLength(line))
    if (feature === getters.lineFeature) { commit("setLength") }}
    return styles;
  }
  return styleFunc
}
