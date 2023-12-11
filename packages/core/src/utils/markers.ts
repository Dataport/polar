import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import { MarkerStyle } from '@polar/lib-custom-types'

export type GetMarkerFunction = (style: MarkerStyle, multi: boolean) => Style

// these have been measured to fit once and influence marker size
export const imgSize = [23, 32]
export const imgSizeMulti = [35, 32]

export const defaultStroke = '#FFFFFF'
export const defaultStrokeWidth = '2'

export const defaultFill = '#005CA9'
export const defaultHoverFill = '#7B1045'
export const defaultSelectionFill = '#679100'

const prefix = 'data:image/svg+xml,'

/* Path of marker svg used in this file copied and adapted from
 * @masterportal/masterportalapi/public/marker.svg. */

export const makeMarker = ({
  stroke = defaultStroke,
  strokeWidth = defaultStrokeWidth,
  fill = defaultFill,
}: MarkerStyle) =>
  `${prefix}${encodeURIComponent(`
<svg width="${imgSize[0]}" height="${imgSize[1]}" viewBox="0 0 30 43" xmlns="http://www.w3.org/2000/svg">
  <title>DB6C494E-88E8-49F1-89CE-97CBEC3A5240</title>
  <path
    d="M14.584 1C7.101 1 1 7.101 1 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C28.168 7.054 22.068 1 14.584 1z"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    fill="${fill}"
    fill-rule="nonzero"
  />
</svg>
`)}`

export const makeMultiMarker = ({
  stroke = defaultStroke,
  strokeWidth = defaultStrokeWidth,
  fill = defaultFill,
}: MarkerStyle) =>
  `${prefix}${encodeURIComponent(`
<svg width="${imgSizeMulti[0]}" height="${imgSizeMulti[1]}" viewBox="0 0 30 43" xmlns="http://www.w3.org/2000/svg">
  <title>0A6F4952-4A5A-4E86-88E4-4B3D2EA1E3DF</title>
  <g stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}" fill-rule="nonzero">
    <path d="M22.584 1C15.101 1 9 7.101 9 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C36.168 7.054 30.068 1 22.584 1z"/>
    <path d="M18.584 1C11.101 1 5 7.101 5 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C32.168 7.054 26.068 1 18.584 1z"/>
    <path d="M14.584 1C7.101 1 1 7.101 1 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C28.168 7.054 22.068 1 14.584 1z"/>
  </g>
</svg>
`)}`

// center bottom of marker 📍 is intended to show the spot
export const anchor = [0.5, 1]

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
        `@polar/core/src/utils/markers.ts: 1000+ styles have been created. This is possibly a memory leak. Please mind that the methods exported by this module are memoized. You *may* be calling the methods with constantly newly generated objects, or maybe there's just a lot of styles.`
      )
    }
    return markerStyle
  }
}

const getGetStyle =
  (fallbackFill: string): GetMarkerFunction =>
  (style, multi = false) =>
    new Style({
      image: new Icon({
        src: (multi ? makeMultiMarker : makeMarker)({
          fill: fallbackFill,
          ...style,
        }),
        anchor,
      }),
    })

export const getDefaultStyle = memoizeStyle(getGetStyle(defaultFill))

export const getHoveredStyle = memoizeStyle(
  memoizeStyle(getGetStyle(defaultHoverFill))
)

export const getSelectedStyle = memoizeStyle(
  memoizeStyle(getGetStyle(defaultSelectionFill))
)
