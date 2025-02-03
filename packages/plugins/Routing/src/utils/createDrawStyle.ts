import { RouteStyle } from '@polar/lib-custom-types'
import { Style, Stroke } from 'ol/style'

export default function (strokeColor: string, routeStyle?: RouteStyle): Style {
  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: routeStyle?.stroke?.width || 2,
    }),
  })
}
