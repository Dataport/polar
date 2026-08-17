/**
 * This file contains the SVG-informations
 * the 'path' / 'viewBox' / 'position of the text element' of the markers
 * it will be used in the marker.ts file to create the marker icons
 * for the map.
 */

import type {
	GetSVGConfigFunction,
	GetTextPositionFunction,
	MarkerSVGConfig,
	TextPosition,
} from '../types'

export const getSVGConfig: GetSVGConfigFunction = (digits: string) => {
	switch (digits.length) {
		case 0:
			case 1:
			return singleMarkerSVG
		case 2:
			return twoDigitsMarkerSVG
		case 3:
			return threeDigitsMarkerSVG
		case 4:
			return fourDigitsMarkerSVG
		case 5:
			return fiveDigitsMarkerSVG
		default:
			throw new Error('Unsupported number of digits')
	}
}

/**
 * Calculates the optically centered text position for a pill SVG path.
 * Expected paths in the scheme: M[x] [y] C... [xLeftCap] [yTop] h[width] C... S... [xRightCap] [yBottom] h-[width] C... Z
 */
export const getPillTextPosition: GetTextPositionFunction = (
	path: string
): TextPosition => {
	const nums = path.match(
		/C[\d.]+ [\d.]+ [\d.]+ [\d.]+ ([\d.]+) ([\d.]+)\s*h([\d.]+)\s*C[\d.]+ [\d.]+ [\d.]+ [\d.]+ [\d.]+ [\d.]+\s*S[\d.]+ ([\d.]+)/
	)
	if (!nums) {
		throw new Error('Path does not match expected marker pattern')
	}
	const [, xLeftCapStr, yTopStr, hWidthStr, yBottomStr] = nums as [
		string,
		string,
		string,
		string,
		string,
	]
	const xLeftCap = parseFloat(xLeftCapStr)
	const yTop = parseFloat(yTopStr)
	const hWidth = parseFloat(hWidthStr)
	const yBottom = parseFloat(yBottomStr)
	const textPosition: TextPosition = {
		x: xLeftCap + hWidth / 2 - 3, // The −n offset on x and y corrects the optical shift caused by the stacked shapes
		y: (yTop + yBottom) / 2 - 1,
	}

	return textPosition
}

/**
 * Calculates the optically centered text position for a round SVG path (circle with tip).
 * Expected paths in the scheme: M[xStart] [yStart]c[dx1][dy1][dx2][dy2] [dxEnd][dyEnd]s[dx2][dy2] [dxEnd] [dyEnd] [dx2] [dy2] [dxEnd] [dyEnd]L[tipX] [tipY]a...l...Z
 */
export const getCircleTextPosition: GetTextPositionFunction = (
	path: string
): TextPosition => {
	const mMatch = path.match(/M([\d.]+)\s+([\d.]+)/)
	const cSection = path.match(/c([^sS]+)/)
	const sSection = path.match(/s([^lL]+)/)
	if (!mMatch || !cSection || !sSection) {
		throw new Error('Path does not match expected round marker pattern')
	}
	if (!cSection[1] || !sSection[1]) {
		throw new Error('Path does not match expected round marker pattern')
	}
	const cNums = cSection[1].match(/-?[\d.]+/g)
	const sNums = sSection[1].match(/-?[\d.]+/g)
	if (!cNums || cNums.length < 6 || !sNums || sNums.length < 4) {
		throw new Error('Path does not match expected round marker pattern')
	}
	if (!mMatch[1] || !mMatch[2] || !cNums[5] || !sNums[2]) {
		throw new Error('Path does not match expected round marker pattern')
	}
	const startX = parseFloat(mMatch[1])
	const startY = parseFloat(mMatch[2])
	const cDy = parseFloat(cNums[5]) // relative dy des c-Endpunkts (negativ = nach oben)
	const sDx = parseFloat(sNums[2]) // relative dx des ersten s-Endpunkts (positiv = nach rechts)

	return {
		x: startX + sDx / 2 - 4, // The −4 offset on x and y corrects the optical shift caused by the stacked shapes
		y: startY + cDy / 2,
	}
}

// The paths always follow the scheme: M[xStart] [yMid] C... [xLeftCap] [yTop] h[width] C... [xRight] [yMid] S... [xRightCap] [yBottom] h-[width] C... Z
export const singleMarkerSVG: MarkerSVGConfig = {
	path: 'd="M14.747 32.253c-5.663-5.663-5.663-14.843 0-20.506s14.843-5.663 20.506 0 5.663 14.843 0 20.506L26.206 41.3a1.706 1.706 0 0 1-2.412 0l-9.047-9.047Z"',
	stackedPath1:
		'd="M12.747 31.253c-5.663-5.663-5.663-14.843 0-20.506s14.843-5.663 20.506 0 5.663 14.843 0 20.506L24.206 40.3a1.706 1.706 0 0 1-2.412 0l-9.047-9.047Z"',
	stackedPath2:
		'd="M10.747 30.253c-5.663-5.663-5.663-14.843 0-20.506s14.843-5.663 20.506 0 5.663 14.843 0 20.506L22.206 39.3a1.706 1.706 0 0 1-2.412 0l-9.047-9.047Z"',
	tipPath: '',
	viewBox: '"0 0 48 54"',
	get textPosition() {
		return this.getTextPosition(this.path)
	},
	getTextPosition: getCircleTextPosition,
}

export const twoDigitsMarkerSVG: MarkerSVGConfig = {
	path: 'd="M7 21.5C7 13.492 13.492 7 21.5 7h11C40.508 7 47 13.492 47 21.5S40.508 36 32.5 36h-11C13.492 36 7 29.508 7 21.5Z"',
	stackedPath1:
		'd="M5 20.5C5 12.492 11.492 6 19.5 6h11C38.508 6 45 12.492 45 20.5S38.508 35 30.5 35h-11C11.492 35 5 28.508 5 20.5Z"',
	stackedPath2:
		'd="M3 19.5C3 11.492 9.492 5 17.5 5h11C36.508 5 43 11.492 43 19.5S36.508 34 28.5 34h-11C9.492 34 3 27.508 3 19.5Z"',
	tipPath: 'd="M27 36h-6l4.482 5.228a2 2 0 0 0 3.037 0L33 36h-6Z"',
	viewBox: '"0 0 50 54"',
	get textPosition() {
		return this.getTextPosition(this.path)
	},
	getTextPosition: getPillTextPosition,
}

export const threeDigitsMarkerSVG: MarkerSVGConfig = {
	path: 'd="M10 22.5C10 14.492 16.492 8 24.5 8h19C51.508 8 58 14.492 58 22.5S51.508 37 43.5 37h-19C16.492 37 10 30.508 10 22.5Z"',
	stackedPath1:
		'd="M6 20.5C6 12.492 12.492 6 20.5 6h19C47.508 6 54 12.492 54 20.5S47.508 35 39.5 35h-19C12.492 35 6 28.508 6 20.5Z"',
	stackedPath2: '',
	tipPath: 'd="M34 37h-6l4.481 5.228a2 2 0 0 0 3.038 0L40 37h-6Z"',
	viewBox: '"0 0 64 55"',
	get textPosition() {
		return this.getTextPosition(this.path)
	},
	getTextPosition: getPillTextPosition,
}

export const fourDigitsMarkerSVG: MarkerSVGConfig = {
	path: 'd="M8 22.5C8 14.492 14.492 8 22.5 8h30C60.508 8 67 14.492 67 22.5S60.508 37 52.5 37h-30C14.492 37 8 30.508 8 22.5Z"',
	stackedPath1:
		'd="M6 20.5C6 13.596 11.596 8 18.5 8h30C55.404 8 61 13.596 61 20.5S55.404 33 48.5 33h-30C11.596 33 6 27.404 6 20.5Z"',
	stackedPath2: '',
	tipPath: 'd="M37.5 37h-6l4.481 5.228a2 2 0 0 0 3.038 0L43.5 37h-6Z"',
	viewBox: '"0 0 72 55"',
	get textPosition() {
		return this.getTextPosition(this.path)
	},
	getTextPosition: getPillTextPosition,
}

export const fiveDigitsMarkerSVG: MarkerSVGConfig = {
	path: 'd="M9 22.5C9 14.492 15.492 8 23.5 8h38C69.508 8 76 14.492 76 22.5S69.508 37 61.5 37h-38C15.492 37 9 30.508 9 22.5Z"',
	stackedPath1:
		'd="M7 20.5C7 13.596 12.596 8 19.5 8h38C64.404 8 70 13.596 70 20.5S64.404 33 57.5 33h-38C12.596 33 7 27.404 7 20.5Z"',
	stackedPath2:
		'd="M5 20.5C5 12.492 11.492 6 19.5 6h38C65.508 6 72 12.492 72 20.5S65.508 35 57.5 35h-38C11.492 35 5 28.508 5 20.5Z"',
	tipPath: 'd="M42.5 37h-6l4.481 5.228a2 2 0 0 0 3.038 0L48.5 37h-6Z"',
	viewBox: '"0 0 80 55"',
	get textPosition() {
		return this.getTextPosition(this.path)
	},
	getTextPosition: getPillTextPosition,
}
