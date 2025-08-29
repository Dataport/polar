import type { Color } from '@/core'

export function getCssColor(color: Color): string {
	if (typeof color === 'object') {
		if ('oklch' in color) {
			return `oklch(${color.oklch.l}, ${color.oklch.c}, ${color.oklch.h})`
		}
		if ('rgba' in color) {
			if (color.rgba.a) {
				return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`
			}
			return `rgb(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b})`
		}
	}

	return color
}
