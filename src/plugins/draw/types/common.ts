/**
 * TODO: document for configuration
 * @defaultValue `['Point', 'LineString', 'Polygon']`
 */
export const DrawModes = [
	'Point',
	'LineString',
	'Polygon',
	'Circle',
	'Text',
	// TODO: handling requires distinction when a multi is 'active'/'finished'
	// 'MultiLineString',
	// 'MultiPoint',
	// 'MultiPolygon',
] as const

/**
 * TODO: document for configuration
 * TODO: document defaultValue
 */
export interface DrawFontStyle {
	family: string
	size: number[]
}

/**
 * TODO: document for configuration
 * TODO: document defaultValue
 */
export interface DrawTextStyle {
	font: string | DrawFontStyle
	textColor?: string
}

/**
 * Supported geometry types for draw tool mode.
 * Please mind that 'Text' and 'Circle' do not transfer to GeoJSON, and hence will only work in clients sharing the opinionated formatting of POLAR.
 * To avoid this issue, do not configure these properties.
 */
export type DrawMode = (typeof DrawModes)[number]
