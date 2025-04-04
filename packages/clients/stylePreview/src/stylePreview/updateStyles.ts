import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style'
// TODO maybe refactor; there's also an implementation in the masterportalapi that could be used
import { getPolygonFillHatch } from '@polar/core/src/utils/markers/hatches'
import { features } from './features'

// imitate class to match keyMap ...
function Hatch(params) {
  return getPolygonFillHatch(params)?.getContext('2d')?.fillStyle
}

// maps keys from source to key that's actually to be written
const keyKey = (key) =>
  ({
    imageCircle: 'image',
    imageIcon: 'image',
    hatch: 'color',
  }[key] || key)

const keyMap = {
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
        if (keyMap[key]) {
          accumulator[keyKey(key)] = new keyMap[key]({
            ...buildStyle(value),
            ...(key === 'text' ? { text: 'Testtext' } : {}),
          })
        } else {
          accumulator[keyKey(key)] = buildStyle(value)
        }
        return accumulator
      }, {})
    : style

export const updateStyles = (styles) =>
  Object.entries(features).forEach(([key, feature]) =>
    feature.setStyle(new Style(buildStyle(styles[key])))
  )
