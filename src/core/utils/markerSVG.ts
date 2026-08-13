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
			return circlePin
		case 1:
			return circlePinStacked
		case 2:
			return twoDigitsPin
		case 3:
			return threeDigitsPin
		case 4:
			return fourDigitsPin
		case 5:
			return fiveDigitsPin
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
	const topMatch = path.match(
		/C\s*[-\d.]+\s+[-\d.]+\s+[-\d.]+\s+[-\d.]+\s+([-\d.]+)\s+([-\d.]+)\s*h\s*-?[\d.]+/
	)
	const bottomMatch = path.match(
		/S\s*[-\d.]+\s+[-\d.]+\s+([-\d.]+)\s+([-\d.]+)\s*h\s*-?[\d.]+/
	)

	if (!topMatch || !bottomMatch) {
		throw new Error('Path does not match expected marker pattern')
	}

	const [, xLeftCapStr, yTopStr] = topMatch as [string, string, string]
	const [, xRightCapStr, yBottomStr] = bottomMatch as [string, string, string]

	const xLeftCap = parseFloat(xLeftCapStr)
	const xRightCap = parseFloat(xRightCapStr)
	const yTop = parseFloat(yTopStr)
	const yBottom = parseFloat(yBottomStr)

	return {
		x: (xLeftCap + xRightCap) / 2,
		y: (yTop + yBottom) / 2,
	}
}

/**
 * Calculates the optically centered text position for a round SVG path (circle with tip).
 * Expected paths in the scheme: M[x0] [y0]C[x1] [y1] [x2] [y2] [x3] [y3]S[x4] [y4] [x5] [y5] [x6] [y6] [x7] [y7]Z
 */
export const getCircleCenterPosition: GetTextPositionFunction = (
	path: string
): TextPosition => {
	const mMatch = path.match(/M\s*([\d.]+)\s+([\d.]+)/)
	const sMatch = path.match(/S\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)/)

	if (!mMatch || !sMatch) {
		throw new Error(
			'Path does not match expected circle pattern (M x y ... S cx cy x y)'
		)
	}

	const [, leftXStr, centerYStr] = mMatch as [string, string, string]
	const [, rightXStr] = sMatch as [string, string]

	return {
		x: (parseFloat(leftXStr) + parseFloat(rightXStr)) / 2,
		y: parseFloat(centerYStr),
	}
}

// The paths always follow the scheme: scheme: M[x0] [y0]C[x1] [y1] [x2] [y2] [x3] [y3]S[x4] [y4] [x5] [y5] [x6] [y6] [x7] [y7]Z
export const circlePin: MarkerSVGConfig = {
	contentPath:
		'd="M11 21.5C11 14.596 16.596 9 23.5 9S36 14.596 36 21.5 30.404 34 23.5 34 11 28.404 11 21.5Z"',
	shapePath:
		'd="M13.247 31.753c-5.663-5.663-5.663-14.843 0-20.506s14.843-5.663 20.506 0 5.663 14.843 0 20.506L24.706 40.8a1.706 1.706 0 0 1-2.412 0l-9.047-9.047Z"',
	stackedShape1: '',
	stackedShape2: '',
	stackedTip1: '',
	stackedTip2: '',
	tipPath: '',
	viewBox: '0 0 48 54',
	defs: `<defs>
    <filter id="a" width="35" height="47.3" x="6" y="6" class="a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_255_856"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_255_856" result="effect2_dropShadow_255_856"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_255_856" result="effect3_dropShadow_255_856"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_255_856" result="effect4_dropShadow_255_856"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_255_856" result="effect5_dropShadow_255_856"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_255_856" result="shape"/>
    </filter>
  </defs>`,
	get textPosition() {
		return this.getTextPosition(this.contentPath)
	},
	getTextPosition: getCircleCenterPosition,
	pinShape: 'circle',
}

// The paths always follow the scheme: scheme: M[x0] [y0]C[x1] [y1] [x2] [y2] [x3] [y3]S[x4] [y4] [x5] [y5] [x6] [y6] [x7] [y7]Z
export const circlePinStacked: MarkerSVGConfig = {
	contentPath:
		'd="M8.5 20c0-6.904 5.596-12.5 12.5-12.5S33.5 13.096 33.5 20 27.904 32.5 21 32.5 8.5 26.904 8.5 20Z"',
	shapePath:
		'd="M10.747 30.253c-5.663-5.663-5.663-14.843 0-20.506s14.843-5.663 20.506 0 5.663 14.843 0 20.506L22.206 39.3a1.706 1.706 0 0 1-2.412 0l-9.047-9.047Z"',
	stackedShape1:
		'd="M12.747 31.253c-5.663-5.663-5.663-14.843 0-20.506s14.843-5.663 20.506 0 5.663 14.843 0 20.506L24.206 40.3a1.706 1.706 0 0 1-2.412 0l-9.047-9.047Z"',
	stackedShape2:
		'd="M14.747 32.253c-5.663-5.663-5.663-14.843 0-20.506s14.843-5.663 20.506 0 5.663 14.843 0 20.506L26.206 41.3a1.706 1.706 0 0 1-2.412 0l-9.047-9.047Z"',
	stackedTip1: '',
	stackedTip2: '',
	tipPath: '',
	viewBox: '0 0 48 54',
	defs: `<defs>
    <filter id="a" width="35" height="47.3" x="7.5" y="6.5" class="a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_254_833" result="effect2_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_254_833" result="effect3_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_254_833" result="effect4_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_254_833" result="effect5_dropShadow_254_833"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_254_833" result="shape"/>
    </filter>
    <filter id="b" width="35" height="47.3" x="5.5" y="5.5" class="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_254_833" result="effect2_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_254_833" result="effect3_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_254_833" result="effect4_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_254_833" result="effect5_dropShadow_254_833"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_254_833" result="shape"/>
    </filter>
    <filter id="c" width="35" height="47.3" x="3.5" y="4.5" class="c" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_254_833" result="effect2_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_254_833" result="effect3_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_254_833" result="effect4_dropShadow_254_833"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_254_833" result="effect5_dropShadow_254_833"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_254_833" result="shape"/>
    </filter>
  </defs>`,
	get textPosition() {
		return this.getTextPosition(this.contentPath)
	},
	getTextPosition: getCircleCenterPosition,
	pinShape: 'circle',
}

export const twoDigitsPin: MarkerSVGConfig = {
	contentPath:
		'd="M5 19.5C5 12.596 10.596 7 17.5 7h11C35.404 7 41 12.596 41 19.5S35.404 32 28.5 32h-11C10.596 32 5 26.404 5 19.5Z"',
	shapePath:
		'd="M3 19.5C3 11.492 9.492 5 17.5 5h11C36.508 5 43 11.492 43 19.5S36.508 34 28.5 34h-11C9.492 34 3 27.508 3 19.5Z"',
	tipPath: 'd="M23 34h-6l4.482 5.228a2 2 0 0 0 3.037 0L29 34h-6Z"',
	stackedShape1:
		'd="M5 20.5C5 12.492 11.492 6 19.5 6h11C38.508 6 45 12.492 45 20.5S38.508 35 30.5 35h-11C11.492 35 5 28.508 5 20.5Z"',
	stackedTip1: 'd="M25 35h-6l4.482 5.228a2 2 0 0 0 3.037 0L31 35h-6Z"',
	stackedShape2:
		'd="M7 21.5C7 13.492 13.492 7 21.5 7h11C40.508 7 47 13.492 47 21.5S40.508 36 32.5 36h-11C13.492 36 7 29.508 7 21.5Z"',
	stackedTip2: 'd="M27 36h-6l4.482 5.228a2 2 0 0 0 3.037 0L33 36h-6Z"',
	viewBox: '0 0 50 54',
	defs: `<defs>
    <filter id="a" width="46" height="49" x="4" y="6" class="a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_255_880" result="effect2_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_255_880" result="effect3_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_255_880" result="effect4_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_255_880" result="effect5_dropShadow_255_880"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_255_880" result="shape"/>
    </filter>
    <filter id="b" width="46" height="49" x="2" y="5" class="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_255_880" result="effect2_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_255_880" result="effect3_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_255_880" result="effect4_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_255_880" result="effect5_dropShadow_255_880"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_255_880" result="shape"/>
    </filter>
    <filter id="c" width="46" height="49" x="0" y="4" class="c" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_255_880" result="effect2_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_255_880" result="effect3_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_255_880" result="effect4_dropShadow_255_880"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_255_880" result="effect5_dropShadow_255_880"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_255_880" result="shape"/>
    </filter>
  </defs>`,
	get textPosition() {
		return this.getTextPosition(this.contentPath)
	},
	getTextPosition: getPillTextPosition,
	pinShape: 'pill',
}

export const threeDigitsPin: MarkerSVGConfig = {
	contentPath:
		'd="M8 20.5C8 13.596 13.596 8 20.5 8h19C46.404 8 52 13.596 52 20.5S46.404 33 39.5 33h-19C13.596 33 8 27.404 8 20.5Z"',
	shapePath:
		'd="M6 20.5C6 12.492 12.492 6 20.5 6h19C47.508 6 54 12.492 54 20.5S47.508 35 39.5 35h-19C12.492 35 6 28.508 6 20.5Z"',
	tipPath: 'd="M30 35h-6l4.482 5.228a2 2 0 0 0 3.037 0L36 35h-6Z"',
	stackedShape1:
		'd="M8 21.5C8 13.492 14.492 7 22.5 7h19C49.508 7 56 13.492 56 21.5S49.508 36 41.5 36h-19C14.492 36 8 29.508 8 21.5Z"',
	stackedTip1: 'd="M32 36h-6l4.482 5.228a2 2 0 0 0 3.037 0L38 36h-6Z"',
	stackedShape2:
		'd="M10 22.5C10 14.492 16.492 8 24.5 8h19C51.508 8 58 14.492 58 22.5S51.508 37 43.5 37h-19C16.492 37 10 30.508 10 22.5Z"',
	stackedTip2: 'd="M34 37h-6l4.481 5.228a2 2 0 0 0 3.038 0L40 37h-6Z"',
	viewBox: '0 0 64 55',
	defs: `<defs>
    <filter id="a" width="54" height="49" x="7" y="7" class="a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_909" result="effect2_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_909" result="effect3_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_909" result="effect4_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_909" result="effect5_dropShadow_256_909"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_909" result="shape"/>
    </filter>
    <filter id="b" width="54" height="49" x="5" y="6" class="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_909" result="effect2_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_909" result="effect3_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_909" result="effect4_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_909" result="effect5_dropShadow_256_909"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_909" result="shape"/>
    </filter>
    <filter id="c" width="54" height="49" x="3" y="5" class="c" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_909" result="effect2_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_909" result="effect3_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_909" result="effect4_dropShadow_256_909"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_909" result="effect5_dropShadow_256_909"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_909" result="shape"/>
    </filter>
  </defs>`,
	get textPosition() {
		return this.getTextPosition(this.contentPath)
	},
	getTextPosition: getPillTextPosition,
	pinShape: 'pill',
}

export const fourDigitsPin: MarkerSVGConfig = {
	contentPath:
		'd="M6 20.5C6 13.596 11.596 8 18.5 8h30C55.404 8 61 13.596 61 20.5S55.404 33 48.5 33h-30C11.596 33 6 27.404 6 20.5Z"',
	shapePath:
		'd="M4 20.5C4 12.492 10.492 6 18.5 6h30C56.508 6 63 12.492 63 20.5S56.508 35 48.5 35h-30C10.492 35 4 28.508 4 20.5Z"',
	tipPath: 'd="M33.5 35h-6l4.482 5.228a2 2 0 0 0 3.037 0L39.5 35h-6Z"',
	stackedShape1:
		'd="M6 21.5C6 13.492 12.492 7 20.5 7h30C58.508 7 65 13.492 65 21.5S58.508 36 50.5 36h-30C12.492 36 6 29.508 6 21.5Z"',
	stackedTip1: 'd="M35.5 36h-6l4.481 5.228a2 2 0 0 0 3.038 0L41.5 36h-6Z"',
	stackedShape2:
		'd="M8 22.5C8 14.492 14.492 8 22.5 8h30C60.508 8 67 14.492 67 22.5S60.508 37 52.5 37h-30C14.492 37 8 30.508 8 22.5Z"',
	stackedTip2: 'd="M37.5 37h-6l4.481 5.228a2 2 0 0 0 3.038 0L43.5 37h-6Z"',
	viewBox: '0 0 72 55',
	defs: `<defs>
    <filter id="a" width="65" height="49" x="5" y="7" class="a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_917" result="effect2_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_917" result="effect3_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_917" result="effect4_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_917" result="effect5_dropShadow_256_917"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_917" result="shape"/>
    </filter>
    <filter id="b" width="65" height="49" x="3" y="6" class="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_917" result="effect2_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_917" result="effect3_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_917" result="effect4_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_917" result="effect5_dropShadow_256_917"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_917" result="shape"/>
    </filter>
    <filter id="c" width="65" height="49" x="1" y="5" class="c" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_917" result="effect2_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_917" result="effect3_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_917" result="effect4_dropShadow_256_917"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_917" result="effect5_dropShadow_256_917"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_917" result="shape"/>
    </filter>
  </defs>`,
	get textPosition() {
		return this.getTextPosition(this.contentPath)
	},
	getTextPosition: getPillTextPosition,
	pinShape: 'pill',
}

export const fiveDigitsPin: MarkerSVGConfig = {
	contentPath:
		'd="M7 20.5C7 13.596 12.596 8 19.5 8h38C64.404 8 70 13.596 70 20.5S64.404 33 57.5 33h-38C12.596 33 7 27.404 7 20.5Z"',
	shapePath:
		'd="M5 20.5C5 12.492 11.492 6 19.5 6h38C65.508 6 72 12.492 72 20.5S65.508 35 57.5 35h-38C11.492 35 5 28.508 5 20.5Z"',
	tipPath: 'd="M38.5 35h-6l4.481 5.228a2 2 0 0 0 3.038 0L44.5 35h-6Z"',
	stackedShape1:
		'd="M7 21.5C7 13.492 13.492 7 21.5 7h38C67.508 7 74 13.492 74 21.5S67.508 36 59.5 36h-38C13.492 36 7 29.508 7 21.5Z"',
	stackedTip1: 'd="M40.5 36h-6l4.481 5.228a2 2 0 0 0 3.038 0L46.5 36h-6Z"',
	stackedShape2:
		'd="M9 22.5C9 14.492 15.492 8 23.5 8h38C69.508 8 76 14.492 76 22.5S69.508 37 61.5 37h-38C15.492 37 9 30.508 9 22.5Z"',
	stackedTip2: 'd="M42.5 37h-6l4.481 5.228a2 2 0 0 0 3.038 0L48.5 37h-6Z"',
	viewBox: '0 0 80 55',
	defs: `<defs>
    <filter id="a" width="73" height="49" x="6" y="7" class="a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_939" result="effect2_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_939" result="effect3_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_939" result="effect4_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_939" result="effect5_dropShadow_256_939"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_939" result="shape"/>
    </filter>
    <filter id="b" width="73" height="49" x="4" y="6" class="b" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_939" result="effect2_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_939" result="effect3_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_939" result="effect4_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_939" result="effect5_dropShadow_256_939"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_939" result="shape"/>
    </filter>
    <filter id="c" width="73" height="49" x="2" y="5" class="c" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.39 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="1"/>
      <feGaussianBlur stdDeviation=".5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.34 0"/>
      <feBlend in2="effect1_dropShadow_256_939" result="effect2_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.2 0"/>
      <feBlend in2="effect2_dropShadow_256_939" result="effect3_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="6"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.06 0"/>
      <feBlend in2="effect3_dropShadow_256_939" result="effect4_dropShadow_256_939"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="9"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix values="0 0 0 0 0.207843 0 0 0 0 0.223529 0 0 0 0 0.337255 0 0 0 0.01 0"/>
      <feBlend in2="effect4_dropShadow_256_939" result="effect5_dropShadow_256_939"/>
      <feBlend in="SourceGraphic" in2="effect5_dropShadow_256_939" result="shape"/>
    </filter>
  </defs>`,
	get textPosition() {
		return this.getTextPosition(this.contentPath)
	},
	getTextPosition: getPillTextPosition,
	pinShape: 'pill',
}
