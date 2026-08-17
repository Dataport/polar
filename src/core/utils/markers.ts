import type { GetMarkerFunction, MarkerStyle, MarkerSVGConfig } from '../types'

import PolygonStyle from '@masterportal/masterportalapi/src/vectorStyle/styles/polygon/stylePolygon'
import Icon from 'ol/style/Icon'
import Style from 'ol/style/Style'

import { circlePin, getSVGConfig } from './markerSVG'

const polygonStyle = new PolygonStyle()
const prefix = 'data:image/svg+xml;base64,'
const encodeSVG = (svg: string) => btoa(unescape(encodeURIComponent(svg)))

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
  <g class="feature-pin-default">
    <g class="feature-pin-content">
      <g class="feature-pin-shape" filter="url(#a)">
        <path fill-rule="nonzero" fill="${stroke}" ${circlePin.shapePath}/>
      </g>
      <path fill-rule="nonzero" fill="${typeof fill === 'string' ? fill : 'url(#img)'}" ${circlePin.contentPath} class="feature-flag-background"/>
    </g>
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
  <g class="feature-pin-default-stacked">
      <g class="feature-pin-content">
        <g class="feature-pin-shape" filter="url(#a)">
          <path fill="${stroke}" ${svgConfig.stackedShape2}/>
        </g>
        <g class="feature-pin-shape" filter="url(#b)">
          <path fill="${stroke}" ${svgConfig.stackedShape1}/>
        </g>
        <g class="feature-pin-shape" filter="url(#c)">
          <path fill="${stroke}" ${svgConfig.shapePath}/>
        </g>
        <path fill="${typeof fill === 'string' ? fill : 'url(#img)'}"  fill-rule="nonzero"
            ${svgConfig.contentPath} class="feature-flag-background"/>
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
	</g>
</svg>
`)}`
		: `${prefix}${encodeSVG(`
<svg width="${clusterSize[0]}" height="${clusterSize[1]}"
	viewBox="${svgConfig.viewBox}" xmlns="http://www.w3.org/2000/svg">
  <title>0A6F4952-4A5A-4E86-88E4-4B3D2EA1E3DF</title>
  ${getImagePattern(fill)}
<g class="feature-pin-five-digits-stacked">
    <g class="feature-pin-five-digits" filter="url(#a)">
      <path fill="${stroke}" ${svgConfig.stackedShape2} class="feature-pin-content"/>
      <path fill="${stroke}" ${svgConfig.stackedTip2} class="feature-pin-tip"/>
    </g>
    <g class="feature-pin-five-digits" filter="url(#b)">
      <path fill="${stroke}" ${svgConfig.stackedShape1} class="feature-pin-content"/>
      <path fill="${stroke}" ${svgConfig.stackedTip1} class="feature-pin-tip"/>
    </g>
    <g class="feature-pin-five-digits" filter="url(#c)">
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
  </g>
</svg>
`)}`
}

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

const memoCountStyle = (getMarker: GetMarkerFunction): GetMarkerFunction => {
	const countCache = new Map<number, Map<MarkerStyle, Style>>()
	return (style, count, displayFeatureCount) => {
		// vielleicht auslagern und ind warnMeoLeak einbinden?
		const getTotalCachedStyles = (
			countCache: Map<number, Map<MarkerStyle, Style>>
		): number => {
			let total = 0
			for (const stylesByCount of countCache.values()) {
				total += stylesByCount.size
			}
			return total
		}

		const cache = countCache.get(count) || new Map<MarkerStyle, Style>()
		if (cache.has(style)) {
			return cache.get(style) as Style
		}
		const markerStyle = getMarker(style, count, displayFeatureCount)
		cache.set(style, markerStyle)
		countCache.set(count, cache)
		warnMemoLeak(getTotalCachedStyles(countCache))
		return markerStyle
	}
}

/**
 * The map became a little laggy due to constant re-generation of styles.
 * This memoization function optimises this issue by reusing styles.
 * */
const memoizeStyle = (getMarker: GetMarkerFunction): GetMarkerFunction => {
	const memoizedCountStyle = memoCountStyle(getMarker)
	const memoizedStyle = memoStyle(getMarker)
	return (style, count, displayFeatureCount) =>
		displayFeatureCount
			? memoizedCountStyle(style, count, displayFeatureCount)
			: memoizedStyle(style, count, displayFeatureCount)
}

const getStyleFunction: GetMarkerFunction = (
	style,
	count,
	displayFeatureCount
) =>
	new Style({
		image: new Icon({
			src:
				count > 1
					? makeMultiMarker(
							{
								...style,
								displayedText: count,
							},
							displayFeatureCount,
							getSVGConfig(String(count))
						)
					: makeMarker(style),
			anchor,
		}),
	})

export const getMarkerStyle = memoizeStyle(getStyleFunction)
