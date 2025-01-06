import hexToRgb from 'hex-rgb'
import { Text, Fill, Stroke, Style, Circle } from 'ol/style'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'
import { StyleParameters } from '../types'

const makePolygonStyle = (
  color: Color | ColorLike,
  backgroundColor: Color | ColorLike,
  width: number
) =>
  new Style({
    stroke: new Stroke({ color, width }),
    fill: new Fill({ color: backgroundColor }),
  })

const makeLineStyle = (
  color: Color | ColorLike,
  textColor: Color | ColorLike,
  lineWidth: number
) =>
  new Style({
    stroke: new Stroke({ color: textColor, width: lineWidth / 5 }),
    text: new Text({
      font: 'bold 14px cursive',
      placement: 'line',
      fill: new Fill({ color: textColor }),
      stroke: new Stroke({ color }),
      offsetY: -5,
    }),
  })

const makePointStyle = (
  color: Color | ColorLike,
  pointColor: Color | ColorLike,
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
 * Creates the styles for Polygons, LineStrings with Text and Points with the given parameters.
 */
export default function ({
  color,
  lineWidth,
  opacity: originalOpacity,
  pointWidth,
  textColor,
}: StyleParameters): Style[] {
  // Only rgb, rgba and hex are currently allowed
  let rgb = color as number[]
  let opacity = originalOpacity
  if (typeof color === 'string') {
    const { red, green, blue, alpha } = hexToRgb(color)
    rgb = [red, green, blue]
    opacity = alpha
  }

  return [
    makePolygonStyle([...rgb, opacity], [...rgb, opacity / 3], lineWidth),
    makeLineStyle(color, textColor, lineWidth),
    makePointStyle([...rgb, opacity], [...rgb, opacity / 2], pointWidth),
  ]
}
