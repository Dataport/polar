import type { GetMarkerFunction, MarkerStyle, MarkerSVGConfig } from '../types'

import PolygonStyle from '@masterportal/masterportalapi/src/vectorStyle/styles/polygon/stylePolygon'
import Icon from 'ol/style/Icon'
import Style from 'ol/style/Style'

import { getSVGConfig, singleMarkerSVG } from './markerSVG'

const polygonStyle = new PolygonStyle()
const prefix = 'data:image/svg+xml,'

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

const makeMarker = ({ fill, size, stroke, strokeWidth }: MarkerStyle) =>
	`${prefix}${encodeURIComponent(`
<svg width="${size[0]}" height="${
		size[1]
	}" viewBox=${singleMarkerSVG.viewBox} xmlns="http://www.w3.org/2000/svg">
  <title>DB6C494E-88E8-49F1-89CE-97CBEC3A5240</title>
  ${getImagePattern(fill)}
  <path
    ${singleMarkerSVG.path}
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    fill="${typeof fill === 'string' ? fill : 'url(#img)'}"
    fill-rule="nonzero"
  />
</svg>
`)}`

const makeMultiMarker = (
	{ fill, clusterSize, stroke, strokeWidth, displayedText }: MarkerStyle,
	displayFeatureCount: boolean,
	svgConfig: MarkerSVGConfig
) =>
	`${prefix}${encodeURIComponent(`
<svg width="${clusterSize[0]}" height="${
		clusterSize[1]
	}" viewBox=${svgConfig.viewBox} xmlns="http://www.w3.org/2000/svg">
  <title>0A6F4952-4A5A-4E86-88E4-4B3D2EA1E3DF</title>
  ${getImagePattern(fill)}
  <g stroke="${stroke}" stroke-width="${strokeWidth}" fill="${
		typeof fill === 'string' ? fill : 'url(#img)'
	}" fill-rule="nonzero">
	<path ${svgConfig.path}/>
	<path ${svgConfig.stackedPath1}/>
	<path ${svgConfig.stackedPath2}/>
  </g>
	${
		!displayFeatureCount || displayedText === undefined
			? ''
			: `<text
	x="${svgConfig.textPosition.x}"
    y="${svgConfig.textPosition.y}"
    text-anchor="middle"
    dominant-baseline="central"
    font-size="14"
    font-weight="700"
    fill="#ffffff"
	>${String(displayedText)}</text>`
	}
	  <g stroke="${stroke}" stroke-width="${strokeWidth}" fill="${
			typeof fill === 'string' ? fill : 'url(#img)'
		}" fill-rule="nonzero">
	<path ${svgConfig.tipPath}/>
	</g>
</svg>
`)}`

// center bottom of marker 📍 is intended to show the spot
const anchor = [0.5, 1]

const warnMemoLeak = (styleCount: number) => {
	if (styleCount > 1000) {
		console.warn(
			`1000+ styles have been created. This is possibly a memory leak. Please mind that the methods exported by this module are memoized. You *may* be calling the methods with constantly newly generated objects, or maybe there's just a lot of styles.`
		)
	}
}
const memoStyle = (getMarker: GetMarkerFunction): GetMarkerFunction => {
	const singleCache = new Map()
	const multiCache = new Map()
	return (style, count, displayFeatureCount) => {
		const cache = count > 1 ? multiCache : singleCache
		if (cache.has(style)) {
			return cache.get(style)
		}
		const markerStyle = getMarker(style, count, displayFeatureCount)
		cache.set(style, markerStyle)
		warnMemoLeak(cache.size)
		return markerStyle
	}
}

		}
		return markerStyle
	}
}

const getStyleFunction: GetMarkerFunction = (style, multi) =>
	new Style({
		image: new Icon({
			src: (multi ? makeMultiMarker : makeMarker)(style),
			anchor,
		}),
	})

export const getMarkerStyle = memoizeStyle(getStyleFunction)
