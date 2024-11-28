import VectorLayer from 'ol/layer/Vector'
import { Stroke, Style } from 'ol/style'
import { RouteStyle } from '@polar/lib-custom-types'
import { PolarVectorOptions } from '../types'

/**
 * Creates a new VectorLayer.
 * If certain style parameters, they are used instead of the default styling.
 *
 * @returns VectorLayer for the drawing of the route to reside in.
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
    name: 'RouteFeatureLayer',
    ...options,
  })
}
