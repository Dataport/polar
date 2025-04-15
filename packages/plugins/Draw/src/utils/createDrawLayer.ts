import { DrawStyle } from '@polar/lib-custom-types'
import VectorLayer from 'ol/layer/Vector'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { PolarVectorOptions } from '../types'

/**
 * Creates a new VectorLayer.
 * If certain style parameters, they are used instead of the default styling.
 *
 * @returns VectorLayer for the drawn features to reside in.
 */
export default function (source, style?: DrawStyle) {
  const options: PolarVectorOptions = { source }
  if (style) {
    // TODO: The styling for Stroke and Circle have many more options.
    //  Thus, it could be interesting to divide this function even further
    //  so that every possible option can be used.
    const { fill, stroke, circle } = style
    options.style = new Style({
      fill: new Fill(fill),
      stroke: new Stroke(stroke),
      image: new CircleStyle({
        radius: circle.radius,
        fill: new Fill({ color: circle.fillColor }),
      }),
    })
  }
  return new VectorLayer(options)
}
