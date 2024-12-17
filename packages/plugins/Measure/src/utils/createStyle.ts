import { Text, Fill, Stroke, Style, Circle } from 'ol/style'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'
import { StyleParameter } from '../types'

// TODO: Move me to a lib function (floppy-ears); based on https://stackoverflow.com/a/5624139
/**
 *  First, expand the shorthand form (e.g. "03F") to the full form (e.g. "0033FF").
 *  Then extract the rgb values from the hex string.
 *  Lastly, parse the results as an integer and return is as a rgb array.
 * @param colorHex - Color encoded as a hex string.
 * @returns The given color hex string as a rgb array or null, if the hex couldn't be read.
 */
function hexToRgb(colorHex: string) {
  // TODO: The long format hex code already has the opacity -> if it is long, read it from there ._.
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    colorHex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_, r, g, b) => r + r + g + g + b + b
    )
  )
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}

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
 * Creates three styles Polygone, Lines with Text and Points with the given Parameter
 * @param styleParameter - Parameter for styling
 * @returns Array with three created styles
 */
export default function ({
  color,
  lineWidth,
  opacity,
  pointWidth,
  textColor,
}: StyleParameter): Style[] {
  // Only rgb, rgba and hex are currently allowed
  const rgb = (typeof color === 'string' ? hexToRgb(color) : color) as number[]

  return [
    makePolygonStyle([...rgb, opacity], [...rgb, opacity / 3], lineWidth),
    makeLineStyle(color, textColor, lineWidth),
    makePointStyle([...rgb, opacity], [...rgb, opacity / 2], pointWidth),
  ]
}
