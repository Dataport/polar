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

/**
 * This function builds the parameter tree to an `ol/Style` instantiation.
 * @param styleFragment - This may be anything (except for actual ol instances) that resides at any nesting level in `ol/Style`'s instantiation parameter, which is named `options` in ol's documentation. @see https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html Please mind that only a finite set of nested classes is currently supported, see above function definition and API.md file.
 */
const buildStyle = (styleFragment) =>
  typeof styleFragment === 'object' && !Array.isArray(styleFragment)
    ? Object.entries(styleFragment).reduce((accumulator, [key, value]) => {
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
    : styleFragment

export const updateStyles = (styles) =>
  Object.entries(features).forEach(([key, feature]) =>
    feature.setStyle(new Style(buildStyle(styles[key])))
  )
