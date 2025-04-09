import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style'
import PolygonStyle from '@masterportal/masterportalapi/src/vectorStyle/styles/polygon/stylePolygon'
import { features } from './features'

const polygonStyle = new PolygonStyle()

// imitate class to match keyMap ...
function Hatch(params) {
  return polygonStyle.getPolygonFillHatch(params)?.getContext('2d')?.fillStyle
}

// maps keys from source to key that's actually to be written
const inputKeyToOpenLayersKey = (key: string) =>
  ({
    imageCircle: 'image',
    imageIcon: 'image',
    hatch: 'color',
  }[key] || key)

const inputKeyToOpenLayersClass = {
  fill: Fill,
  stroke: Stroke,
  text: Text,
  imageCircle: Circle,
  imageIcon: Icon,
  hatch: Hatch,
}

const buildStyle = (style) =>
  typeof style === 'object' && !Array.isArray(style)
    ? Object.entries(style).reduce((accumulator, [key, value]) => {
        if (inputKeyToOpenLayersClass[key]) {
          accumulator[inputKeyToOpenLayersKey(key)] =
            new inputKeyToOpenLayersClass[key]({
              ...buildStyle(value),
              ...(key === 'text' ? { text: 'Testtext' } : {}),
            })
        } else {
          accumulator[inputKeyToOpenLayersKey(key)] = buildStyle(value)
        }
        return accumulator
      }, {})
    : style

export const updateStyles = (styles) =>
  Object.entries(features).forEach(([key, feature]) =>
    feature.setStyle(new Style(buildStyle(styles[key])))
  )
