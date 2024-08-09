import { DrawStyle } from '@polar/lib-custom-types'
import { Circle as CircleStyle, Fill, Style, Stroke } from 'ol/style'

export default function (
  drawStyle: DrawStyle | undefined,
  drawMode: string,
  strokeColor?: string
): Style {
  if (drawMode === 'Point') {
    return new Style({
      image: new CircleStyle({
        radius: drawStyle?.circle?.radius || 5,
        fill: drawStyle?.fill.color
          ? new Fill({
              color: drawStyle.fill.color,
            })
          : new Fill({ color: '#ffcc3300' }),
        stroke: new Stroke({ color: strokeColor }),
      }),
    })
  }
  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: drawStyle?.stroke?.width || 2,
    }),
    fill: drawStyle?.fill.color
      ? new Fill({
          color: drawStyle.fill.color,
        })
      : new Fill({ color: '#ffcc3300' }),
  })
}
