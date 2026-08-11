/**
 * This file contains the SVG-informations
 * the 'path' / 'viewBox' / 'position of the text element' of the markers
 * it will be used in the marker.ts file to create the marker icons
 * for the map.
 */

import type {
	GetTextPositionFunction,
	TextPosition,
} from '../types'


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
