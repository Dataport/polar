import { Fill, Stroke, Style } from 'ol/style'
import { dataportPalette, heatPalette } from '../../../palettes'
import { FeatureType } from '../types'

const makeStyle = (
  strokeColor: string,
  fillColor: string,
  zIndex: number
): Style =>
  new Style({
    stroke: new Stroke({ color: strokeColor, width: 2 }),
    fill: new Fill({ color: fillColor }),
    zIndex,
  })

let zIndexCounter = 0

// should never occur – intentionally ugly for quick recognition
const fallbackStyle = makeStyle(
  `${dataportPalette.black}FF`,
  `${dataportPalette.white}FF`,
  ++zIndexCounter
)

const roughBackgroundStyle = makeStyle(
  `${dataportPalette.charcoal}55`,
  `${dataportPalette.charcoal}11`,
  ++zIndexCounter
)

const fineBackgroundStyle = makeStyle(
  `${dataportPalette.charcoal}88`,
  `${dataportPalette.charcoal}22`,
  ++zIndexCounter
)

const wattenmeerStyle = makeStyle(
  `${dataportPalette.viridian}AA`,
  `${dataportPalette.viridian}11`,
  ++zIndexCounter
)

const coldStyle = makeStyle(
  `${dataportPalette.carolinaBlue}FF`,
  `${dataportPalette.carolinaBlue}33`,
  ++zIndexCounter
)

export const heatStyles = heatPalette.map((color) =>
  makeStyle(`${color}FF`, `${color}33`, ++zIndexCounter)
)

export const typeToStyle: Record<FeatureType, Style> = {
  fallback: fallbackStyle,
  roughBackground: roughBackgroundStyle,
  fineBackground: fineBackgroundStyle,
  wattenmeer: wattenmeerStyle,
  detail: coldStyle,
}
