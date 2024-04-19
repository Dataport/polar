import { Text, Fill, Stroke, Style, Circle } from 'ol/style'
import { StyleParameter } from '../types'

/**
 * Creates three styles Polygone, Lines with Text and Points with the given Parameter
 * @param styleParameter - Parameter for styling
 * @param styleParameter.color - Color for lines and the fill bei Polygones
 * @param styleParameter.text - Color for the text
 * @param styleParameter.opacity - Opacity for the lines and text
 * @param styleParameter.pointWidth - Radius for Corner-Points
 * @param styleParameter.lineWidth - Thickness for drawn lines
 * @returns Array with three created styles
 */
export default function ({
  color,
  text,
  opacity,
  pointWidth,
  lineWidth,
}: StyleParameter): Style[] {
  // creates rgba-values with the given parameter
  const mainColor = [color.r, color.g, color.b, opacity]
  const backgroundColor = [color.r, color.g, color.b, opacity / 3]
  const pointColor = [color.r, color.g, color.b, opacity / 2]
  const textColor = [text.r, text.g, text.b, opacity]

  const polygonStyle = new Style({
    stroke: new Stroke({
      color: mainColor,
      width: lineWidth,
    }),
    fill: new Fill({
      color: backgroundColor,
    }),
  })

  // creates styles for Polygone, Lines with Text and Points
  const lineStyle = new Style({
    stroke: new Stroke({
      color: textColor,
      width: lineWidth / 5,
    }),
    text: new Text({
      font: 'bold 10px cursive',
      placement: 'line',
      fill: new Fill({
        color: textColor,
      }),
      stroke: new Stroke({
        color: mainColor,
      }),
      offsetY: -5,
    }),
  })

  const pointStyle = new Style({
    image: new Circle({
      radius: pointWidth,
      stroke: new Stroke({
        color: mainColor,
        width: 1,
      }),
      fill: new Fill({
        color: pointColor,
      }),
    }),
  })

  return [polygonStyle, lineStyle, pointStyle]
}
