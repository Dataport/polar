import { TextStyle } from '@polar/lib-custom-types'
import { Circle as CircleStyle, Fill, Style, Text } from 'ol/style'

export function createTextStyle(
  drawText: string,
  textStyle?: TextStyle,
  textSize?: number
) {
  return new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: '#ffcc3300' }),
    }),
    text: new Text({
      textAlign: 'center',
      text: drawText,
      font: createFont(textStyle, textSize),
      fill: textStyle?.textColor
        ? new Fill({ color: textStyle.textColor })
        : undefined,
      textBaseline: 'middle',
    }),
  })
}

function createFont(textStyle?: TextStyle, textSize?: number) {
  if (typeof textStyle === 'undefined' || textStyle === null) {
    // if empty string apply default open layers style
    return ''
  }
  const { font } = textStyle
  if (typeof font === 'string') {
    return font
  }
  const fontFamily = font.family ? font.family : 'sans-serif'
  return textSize + 'px ' + fontFamily
}
