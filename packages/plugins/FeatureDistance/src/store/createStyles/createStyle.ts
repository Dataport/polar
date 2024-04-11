import { StyleParameter} from '../../types'
import { Text, Fill, Stroke, Style, Circle } from 'ol/style'
import { LineString,  MultiPoint, Polygon } from 'ol/geom'
import { Coordinate } from 'ol/coordinate'


export default function ( { color, text, opacity, pointWidth, lineWidth} : StyleParameter): Style[] 
{
    const c = color;
    const mainColor = [c.r, c.g, c.b, opacity];
    const backgroundColor = [c.r, c.g, c.b, (opacity / 3)];
    const pointColor = [c.r, c.g, c.b, (opacity / 2)];
    const t = text;
    const textColor = [t.r, t.g, t.b, opacity];
  
    const polygonStyle =   new Style({
        stroke: new Stroke({
        color: mainColor,
        width: lineWidth,
      }),
      fill: new Fill({
        color: backgroundColor,
      }),
    });

    const lineStyle = new Style({
      stroke: new Stroke({
        color: textColor,
        width: (lineWidth / 5),
      }),
      text: new Text({
        font: 'bold 10px cursive',
        placement: 'line',
        fill: new Fill({
          color: textColor
        }),
        stroke: new Stroke({
          color: mainColor
        }),
        offsetY: -5,
      })
    });

    const pointStyle = new Style({
      image: new Circle({
        radius: pointWidth,
        stroke: new Stroke({
          color: mainColor,
          width: 1
        }),
        fill: new Fill({
          color: pointColor
        })
      }),
    });
 
    return [polygonStyle, lineStyle, pointStyle,];
}
