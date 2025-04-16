import { RouteStyle } from '@polar/lib-custom-types'
import { Style, Stroke } from 'ol/style'

/**
 * Creates and returns a new OpenLayers Style object for styling a route.
 *
 * This function generates a style with a customizable stroke color and optional stroke width.
//  * If no 'routeStyle' is provided, a default stroke width of 2 is applied.
 *
 * @param strokeColor - The color of the stroke to be applied to the route.
 * @param routeStyle - An optional object that can define additional style properties, such as stroke width.
 * @returns The configured OpenLayers Style object with the specified stroke settings.
 */
export default function (strokeColor: string, routeStyle?: RouteStyle): Style {
  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: routeStyle?.stroke?.width || 2,
    }),
  })
}
