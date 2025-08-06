import PolygonStyle from '@masterportal/masterportalapi/src/vectorStyle/styles/polygon/stylePolygon'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import type { MarkerStyle } from '../types'

const polygonStyle = new PolygonStyle()

type GetMarkerFunction = (style: MarkerStyle, multi: boolean) => Style

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

/* Path of marker svg used in this file copied and adapted from
 * @masterportal/masterportalapi/public/marker.svg. */

const makeMarker = ({ fill, size, stroke, strokeWidth }: MarkerStyle) =>
	`${prefix}${encodeURIComponent(`
<svg width="${size[0]}" height="${
		size[1]
	}" viewBox="0 0 30 43" xmlns="http://www.w3.org/2000/svg">
  <title>DB6C494E-88E8-49F1-89CE-97CBEC3A5240</title>
  ${getImagePattern(fill)}
  <path
    d="M14.584 1C7.101 1 1 7.101 1 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C28.168 7.054 22.068 1 14.584 1z"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    fill="${typeof fill === 'string' ? fill : 'url(#img)'}"
    fill-rule="nonzero"
  />
</svg>
`)}`

const makeMultiMarker = ({
	fill,
	clusterSize,
	stroke,
	strokeWidth,
}: MarkerStyle) =>
	`${prefix}${encodeURIComponent(`
<svg width="${clusterSize[0]}" height="${
		clusterSize[1]
	}" viewBox="0 0 30 43" xmlns="http://www.w3.org/2000/svg">
  <title>0A6F4952-4A5A-4E86-88E4-4B3D2EA1E3DF</title>
  ${getImagePattern(fill)}
  <g stroke="${stroke}" stroke-width="${strokeWidth}" fill="${
		typeof fill === 'string' ? fill : 'url(#img)'
	}" fill-rule="nonzero">
    <path d="M22.584 1C15.101 1 9 7.101 9 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C36.168 7.054 30.068 1 22.584 1z"/>
    <path d="M18.584 1C11.101 1 5 7.101 5 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C32.168 7.054 26.068 1 18.584 1z"/>
    <path d="M14.584 1C7.101 1 1 7.101 1 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C28.168 7.054 22.068 1 14.584 1z"/>
  </g>
</svg>
`)}`

// center bottom of marker 📍 is intended to show the spot
const anchor = [0.5, 1]

/**
 * The map became a little laggy due to constant re-generation of styles.
 * This memoization function optimises this issue by reusing styles.
 * */
const memoizeStyle = (getMarker: GetMarkerFunction): GetMarkerFunction => {
	const singleCache = new Map()
	const multiCache = new Map()
	return (style, multi) => {
		const cache = multi ? multiCache : singleCache
		if (cache.has(style)) {
			return cache.get(style)
		}
		const markerStyle = getMarker(style, multi)
		cache.set(style, markerStyle)
		if (cache.size > 1000) {
			console.warn(
				`1000+ styles have been created. This is possibly a memory leak. Please mind that the methods exported by this module are memoized. You *may* be calling the methods with constantly newly generated objects, or maybe there's just a lot of styles.`
			)
		}
		return markerStyle
	}
}

const getStyleFunction: GetMarkerFunction = (style, multi = false) =>
	new Style({
		image: new Icon({
			src: (multi ? makeMultiMarker : makeMarker)(style),
			anchor,
		}),
	})

export const getMarkerStyle = memoizeStyle(getStyleFunction)
