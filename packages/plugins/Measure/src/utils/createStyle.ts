import { Text, Fill, Stroke, Style, Circle } from 'ol/style'
import { StyleParameter } from '../types'

const makePolygonStyle = (
  color: number[],
  backgroundColor: number[],
  width: number
) =>
  new Style({
    stroke: new Stroke({ color, width }),
    fill: new Fill({ color: backgroundColor }),
  })

const makeLineStyle = (
  color: number[],
  textColor: number[],
  lineWidth: number
) =>
  new Style({
    stroke: new Stroke({ color: textColor, width: lineWidth / 5 }),
    text: new Text({
      font: 'bold 10px cursive',
      placement: 'line',
      fill: new Fill({ color: textColor }),
      stroke: new Stroke({ color }),
      offsetY: -5,
    }),
  })

const makePointStyle = (
  color: number[],
  pointColor: number[],
  radius: number
) =>
  new Style({
    image: new Circle({
      radius,
      stroke: new Stroke({ color, width: 1 }),
      fill: new Fill({ color: pointColor }),
    }),
  })

/**
 * Creates three styles Polygone, Lines with Text and Points with the given Parameter
 * @param styleParameter - Parameter for styling
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
  const rbg = [color.r, color.g, color.b]
  const mainColor = [...rbg, opacity]
  const backgroundColor = [...rbg, opacity / 3]
  const pointColor = [...rbg, opacity / 2]
  const textColor = [text.r, text.g, text.b, opacity]

  return [
    makePolygonStyle(mainColor, backgroundColor, lineWidth),
    makeLineStyle(mainColor, textColor, lineWidth),
    makePointStyle(mainColor, pointColor, pointWidth),
  ]
}
