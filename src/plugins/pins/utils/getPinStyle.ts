import { Style, Icon } from 'ol/style'

import type { PinStyle } from '../types'

import { getPinSvg } from './getPinSvg'

export const getPinStyle = ({
	fill = '#005CA9',
	stroke = '#FFF',
	svg,
}: PinStyle) => {
	let usedFill = ''
	if (typeof fill === 'string') {
		usedFill = fill
	} else if ('oklch' in fill) {
		usedFill = `oklch(${fill.oklch.l} ${fill.oklch.c} ${fill.oklch.h})`
	} else if ('rgba' in fill) {
		usedFill = `${fill.rgba.r} ${fill.rgba.g} ${fill.rgba.b} ${fill.rgba.a ? fill.rgba.a : ''}`
	}

	let usedStroke = ''
	if (typeof stroke === 'string') {
		usedStroke = stroke
	} else if ('oklch' in stroke) {
		usedStroke = `oklch(${stroke.oklch.l} ${stroke.oklch.c} ${stroke.oklch.h})`
	} else if ('rgba' in stroke) {
		usedStroke = `${stroke.rgba.r} ${stroke.rgba.g} ${stroke.rgba.b} ${stroke.rgba.a ? stroke.rgba.a : ''}`
	}

	return new Style({
		image: new Icon({
			src: `data:image/svg+xml;base64,${btoa(getPinSvg(usedFill, usedStroke, svg))}`,
			scale: 2,
			anchor: [0.5, 1],
		}),
	})
}
