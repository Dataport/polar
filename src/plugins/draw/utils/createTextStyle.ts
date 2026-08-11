import type { DrawTextStyle } from '../types'

import { Circle as CircleStyle, Fill, Style, Text } from 'ol/style'

export function createTextStyle(
	drawText: string,
	textStyle?: DrawTextStyle,
	textSize = 12
) {
	return new Style({
		image: new CircleStyle({
			radius: 5,
			fill: new Fill({ color: '#ffcc3300' }),
		}),
		text: new Text({
			textAlign: 'center',
			text: drawText,
			font: createFont(textSize, textStyle),
			fill: textStyle?.textColor
				? new Fill({ color: textStyle.textColor })
				: undefined,
			textBaseline: 'middle',
		}),
	})
}

function createFont(textSize: number, textStyle?: DrawTextStyle) {
	if (typeof textStyle === 'undefined') {
		// if empty string apply default open layers style
		return ''
	}
	const { font } = textStyle
	if (typeof font === 'string') {
		return font
	}
	const fontFamily: string = font?.family ?? 'sans-serif'
	// TODO: If font is an object is also has size defined. Update this when refactoring as well.
	return `${textSize}px ${fontFamily}`
}
