import { DrawStyle } from '@polar/lib-custom-types'
import { Circle as CircleStyle, Fill, Style, Stroke } from 'ol/style'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'

export default function (
  drawMode: string,
  strokeColor: string,
  drawStyle?: DrawStyle
): Style {
  const fillColor = drawStyle?.fill.color ? drawStyle.fill.color : '#ffcc3300'
  if (drawMode === 'Point') {
    return createPointStyle(strokeColor, fillColor, drawStyle?.circle?.radius)
  }
  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: drawStyle?.stroke?.width || 2,
    }),
    fill: new Fill({
      color: fillColor,
    }),
  })
}

function createPointStyle(
  strokeColor: string,
  fillColor: Color | ColorLike,
  radius = 5
) {
  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({ color: strokeColor }),
    }),
  })
}
