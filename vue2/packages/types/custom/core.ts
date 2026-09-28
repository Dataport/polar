import { Options as Fill } from 'ol/style/Fill'
import { Options as Stroke } from 'ol/style/Stroke'
import { type Options as TextOptions } from 'ol/style/Text'
import { Size } from 'ol/size'
import { Color } from 'ol/color'
import { ColorLike } from 'ol/colorlike'

/**
 *
 * Plugin-Container
 *
 */

export interface PolarCircleStyle {
	fillColor?: Color | ColorLike
	radius: number
	strokeColor?: Color | ColorLike
	displacement?: number[]
	scale?: number | Size
	rotation?: number
}

export interface DrawStyle {
	fill: Fill
	stroke: Stroke
	circle: PolarCircleStyle
	measure?: TextOptions
}

export interface TextStyle {
	font: string | FontStyle
	textColor?: Color | ColorLike
}

export interface FontStyle {
	size: number[]
	family: string
}

export type DrawMode = 'Circle' | 'LineString' | 'Point' | 'Polygon' | 'Text'

export type MeasureMode = 'none' | 'metres' | 'kilometres' | 'hectares'

export interface MeasureOptions {
	metres?: boolean
	kilometres?: boolean
	hectares?: boolean
	initialOption?: MeasureMode
}

export interface Lasso {
	id: string
	minZoom: boolean
}

export interface DrawConfiguration /*extends Partial<PluginOptions>*/ {
	addLoading?: string
	enableOptions?: boolean
	lassos?: Lasso[]
	measureOptions?: MeasureOptions
	removeLoading?: string
	revision?: DrawRevision
	selectableDrawModes?: DrawMode[]
	snapTo?: string[]
	style?: DrawStyle
	textStyle?: TextStyle
	toastAction?: string
}

export interface DrawRevision {
	autofix?: boolean
	mergeToMultiGeometries?: boolean
	metaServices?: DrawMetaService[]
	validate?: boolean
}

export interface DrawMetaService {
	id: string
	aggregationMode?: 'unequal' | 'all'
	propertyNames?: string[]
}
