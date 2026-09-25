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
			font: createFont(textSize, textStyle?.font),
			fill: textStyle?.textColor
				? new Fill({ color: textStyle.textColor })
				: undefined,
			textBaseline: 'middle',
		}),
	})
}

function createFont(selectedSize: number, font?: DrawTextStyle['font']) {
	if (typeof font === 'undefined') {
		// if empty string apply default ol style
		return ''
	}
	if (typeof font === 'string') {
		return font
	}
	return `${selectedSize}px ${font.family}`
}
