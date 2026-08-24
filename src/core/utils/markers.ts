import type { GetMarkerFunction, MarkerStyle, MarkerSVGConfig } from '../types'

import PolygonStyle from '@masterportal/masterportalapi/src/vectorStyle/styles/polygon/stylePolygon'
import Icon from 'ol/style/Icon'
import Style from 'ol/style/Style'

import { circlePin, getSVGConfig } from './markerSVG'

const polygonStyle = new PolygonStyle()
const prefix = 'data:image/svg+xml;base64,'
const encodeSVG = (svg: string) => btoa(svg)

const getImagePattern = (fill: MarkerStyle['fill']) =>
	typeof fill === 'string'
		? ''
		: `<defs>
    <pattern id="img" patternUnits="userSpaceOnUse" x="0" y="0" width="${
			fill.size || 30
		}" height="${fill.size || 30}">
      <image href="${polygonStyle.getPolygonFillHatch(fill).toDataURL()}" width="${
				fill.size || 30
			}" height="${fill.size || 30}"/>
    </pattern>
  </defs>`

const makeMarker = ({ fill, size, stroke }: MarkerStyle) =>
	`${prefix}${encodeSVG(`
<svg fill="none" width="${size[0]}" height="${size[1]}" viewBox="${circlePin.viewBox}" xmlns="http://www.w3.org/2000/svg">
  <title>DB6C494E-88E8-49F1-89CE-97CBEC3A5240</title>
  ${getImagePattern(fill)}
<path fill="url(#a)" ${circlePin.shadowPath} class="shadow-image"/>
  <g class="feature-pin-content">
    <path fill="${stroke}" ${circlePin.shapePath} class="feature-pin-shape"/>
    <path
      fill-rule="nonzero"
      fill="${typeof fill === 'string' ? fill : 'url(#img)'}"
      ${circlePin.contentPath}
      class="feature-flag-background"
    />
  </g>
	${circlePin.defs}
</svg>
`)}`

const makeMultiMarker = (
	{ fill, clusterSize, stroke, displayedText }: MarkerStyle,
	displayFeatureCount: boolean,
	svgConfig: MarkerSVGConfig
) => {
	return svgConfig.pinShape === 'circle'
		? `${prefix}${encodeSVG(`
<svg width="${clusterSize[0]}" height="${clusterSize[1]}"
	viewBox="${svgConfig.viewBox}" xmlns="http://www.w3.org/2000/svg">
  <title>0A6F4952-4A5A-4E86-88E4-4B3D2EA1E3DF</title>
  ${getImagePattern(fill)}

  <g class="feature-pin-content">
    <path fill="url(#a)" ${svgConfig.stackedShadow2} class="shadow-image"/>
<path fill="${stroke}" ${svgConfig.stackedShape2} class="feature-pin-shape"/>
<path fill="url(#b)" ${svgConfig.stackedShadow1} class="shadow-image"/>
<path fill="${stroke}" ${svgConfig.stackedShape1} class="feature-pin-shape"/>
<path fill="url(#c)" ${svgConfig.shadowPath} class="shadow-image"/>
<path fill="${stroke}" ${svgConfig.shapePath} class="feature-pin-shape"/>
<path fill="${typeof fill === 'string' ? fill : 'url(#img)'}" ${svgConfig.contentPath} class="feature-flag-background"/>
		${
			!displayFeatureCount || displayedText === undefined
				? ''
				: `<text
                    x="${svgConfig.textPosition.x}"
                    y="${svgConfig.textPosition.y}"
                    text-anchor="middle"
                    dy="0.35em"
                    font-size="18"
                    font-weight="400"
                    font-family="'Fira-sans', sans-serif"
                    font-variant-numeric="slashed-zero"
                        font-feature-settings="'zero' 1"
                    fill="${stroke}"
                >${String(displayedText)}</text>`
		}
  </g>
	${svgConfig.defs}
</svg>
`)}`
		: `${prefix}${encodeSVG(`
<svg width="${clusterSize[0]}" height="${clusterSize[1]}"
	viewBox="${svgConfig.viewBox}" xmlns="http://www.w3.org/2000/svg">
  <title>0A6F4952-4A5A-4E86-88E4-4B3D2EA1E3DF</title>
  ${getImagePattern(fill)}
 <path fill="url(#a)" ${svgConfig.stackedShadow2} class="shadow-image"/>
  <g class="feature-pin-five-digits">
    <path fill="${stroke}" ${svgConfig.stackedShape2} class="feature-pin-content"/>
    <path fill="${stroke}" ${svgConfig.stackedTip2} class="feature-pin-tip"/>
  </g>
  <path fill="url(#b)" ${svgConfig.stackedShadow1} class="shadow-image"/>
  <g class="feature-pin-five-digits">
    <path fill="${stroke}" ${svgConfig.stackedShape1} class="feature-pin-content"/>
    <path fill="${stroke}" ${svgConfig.stackedTip1} class="feature-pin-tip"/>
  </g>
  <path fill="url(#c)" ${svgConfig.shadowPath} class="shadow-image"/>
  <g class="feature-pin-five-digits">
    <g class="feature-pin-content">
      <path fill="${stroke}" ${svgConfig.shapePath}/>
      <path fill="${typeof fill === 'string' ? fill : 'url(#img)'}" ${svgConfig.contentPath} class="feature-flag-label"/>
      ${
				!displayFeatureCount || displayedText === undefined
					? ''
					: `<text
                x="${svgConfig.textPosition.x}"
                y="${svgConfig.textPosition.y}"
                text-anchor="middle"
                dy="0.35em"
                font-size="18"
                font-weight="400"
                font-family="'Fira-sans', sans-serif"
                font-variant-numeric="slashed-zero"
                font-feature-settings="'zero' 1"
                fill="${stroke}"
              >${String(displayedText)}</text>`
			}
    </g>
    <path fill="${stroke}" ${svgConfig.tipPath} class="feature-pin-tip"/>
  </g>
  ${svgConfig.defs}
</svg>
`)}`
}

// center bottom of marker 📍 is intended to show the spot
const anchor = [0.5, 1]

function variantKey(count: number, displayFeatureCount: boolean) {
	if (count <= 1) {
		return 'single'
	}
	return displayFeatureCount ? `multi:${count}` : 'multi'
}

/**
 * The map became a little laggy due to constant re-generation of styles.
 * This memoization function optimises this issue by reusing styles.
 * Styles are cached per (referentially stable) style object and a variant that
 * captures whether it is a single feature, a generic cluster, or a cluster
 * showing a specific count.
 */
const memoizeStyle = (getMarker: GetMarkerFunction): GetMarkerFunction => {
	const cache = new Map<MarkerStyle, Map<string, Style>>()
	let totalStyles = 0
	return (style, count, displayFeatureCount) => {
		const variant = variantKey(count, displayFeatureCount)
		let byVariant = cache.get(style)
		if (!byVariant) {
			byVariant = new Map<string, Style>()
			cache.set(style, byVariant)
		}
		const cached = byVariant.get(variant)
		if (cached) {
			return cached
		}
		const markerStyle = getMarker(style, count, displayFeatureCount)
		byVariant.set(variant, markerStyle)
		totalStyles += 1
		if (totalStyles > 1000) {
			console.warn(
				`1000+ styles have been created. This is possibly a memory leak. Please mind that the methods exported by this module are memoized. You *may* be calling the methods with constantly newly generated objects, or maybe there's just a lot of styles.`
			)
		}
		return markerStyle
	}
}

/*
 * Rasterizes the (expensive) marker SVG into a canvas once and uses that canvas
 * as the icon image.
 */
function buildCanvasIcon(
	requestRender: () => void,
	src: string,
	width: number,
	height: number
) {
	const pixelRatio = window.devicePixelRatio || 1
	const canvas = document.createElement('canvas')
	canvas.width = width * pixelRatio
	canvas.height = height * pixelRatio
	const icon = new Icon({ img: canvas, anchor, scale: 1 / pixelRatio })
	const image = new Image()
	image.onload = () => {
		canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
		requestRender()
	}
	image.src = src
	return icon
}

function buildStyle(
	requestRender: () => void,
	style: MarkerStyle,
	count: number,
	displayFeatureCount: boolean
) {
	const [width, height] = count > 1 ? style.clusterSize : style.size
	const src =
		count > 1
			? makeMultiMarker(
					{
						...style,
						displayedText: count,
					},
					displayFeatureCount,
					getSVGConfig(String(count))
				)
			: makeMarker(style)
	return new Style({
		image: buildCanvasIcon(requestRender, src, width, height),
	})
}

/**
 * Creates a memoized marker-style getter.
 *
 * @param requestRender - Called to trigger a map re-render once an
 *   asynchronously rasterized marker icon becomes available.
 */
export const createGetMarkerStyle = (
	requestRender: () => void
): GetMarkerFunction =>
	memoizeStyle((style, count, displayFeatureCount) =>
		buildStyle(requestRender, style, count, displayFeatureCount)
	)
