import { Style, Icon } from 'ol/style'
import { getPinSvg } from './getPinSvg'

export const getPinStyle = (style) =>
  new Style({
    image: new Icon({
      src: `data:image/svg+xml;base64,${btoa(getPinSvg(style))}`,
      scale: 2,
      anchor: [0.5, 1],
    }),
  })
