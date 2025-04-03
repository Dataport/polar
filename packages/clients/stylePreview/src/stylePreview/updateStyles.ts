import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style'
import { features } from './features'

const keyKey = (key) =>
  ({
    imageCircle: 'image',
    imageIcon: 'image',
  }[key] || key)

const keyMap = {
  fill: Fill,
  stroke: Stroke,
  text: Text,
  imageCircle: Circle,
  imageIcon: Icon,
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
