import VectorLayer from 'ol/layer/Vector'
import { Stroke, Style } from 'ol/style'
import { RouteStyle } from '@polar/lib-custom-types'
import { PolarVectorOptions } from '../types'

/**
 * Creates a new 'VectorLayer' instance for displaying a route with optional styling.
 *
 * @param source - The source of vector data to be used for the route, such as a vector feature or geodata source.
 * @param style - (Optional) A style object for the route, which may contain a 'stroke' (stroke color and width).
 *
 * @returns A new 'VectorLayer' instance containing the route with the provided options.
 */
export default function (source, style?: RouteStyle) {
  const options: PolarVectorOptions = { source }
  if (style) {
    const { stroke } = style
    options.style = new Style({
      stroke: new Stroke(stroke),
    })
  }
  return new VectorLayer({
    ...options,
  })
}
