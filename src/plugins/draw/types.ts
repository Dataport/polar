import type { FeatureCollection, Geometry, GeometryCollection } from 'geojson'
import type { Color } from 'ol/color'
import type { ColorLike } from 'ol/colorlike'
import type { Size } from 'ol/size'
import type { Options as Fill } from 'ol/style/Fill'
import type { Options as Stroke } from 'ol/style/Stroke'
import type { StyleLike } from 'ol/style/Style'
import type { Options as TextOptions } from 'ol/style/Text'

import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import type { PluginOptions } from '@/core'

// TODO: relic
import {
	inactive,
	inProgress,
	complete,
	error,
} from './old_Draw/src/store/reviseFeatures/revisionStates'

/**
 * Plugin identifier.
 */
export const PluginId = 'draw'

export const ToolModes = ['draw', 'edit', 'property', 'delete'] as const
export const DrawModes = [
	'Point',
	'MultiPoint',
	'LineString',
	'MultiLineString',
	'Polygon',
	'MultiPolygon',
	'Circle',
	'Text',
] as const
export const EditModes = [
	'modify',
	'translate',
	'duplicate',
	'cutPolygon',
	'cutMultiPolygon',
	'cutLine',
	'cutMultiLine',
] as const
export const PropertyModes = ['attributes', 'style', 'measurements'] as const
export const DownloadModes = ['geojson'] as const

export type ToolMode = (typeof ToolModes)[number]
export type DrawMode = (typeof DrawModes)[number]
export type EditMode = (typeof EditModes)[number]
export type PropertyMode = (typeof PropertyModes)[number]
export type DownloadMode = (typeof DownloadModes)[number]

export type DrawMetaServiceAggregationMode = 'unequal' | 'all'

export interface DrawMeasureOptions {
	/**
	 * Whether hectares are available for selection.
	 * @defaultValue `true`
	 */
	hectares?: boolean

	/**
	 * Initial measure mode.
	 * @defaultValue `none`
	 */
	initialOption?: DrawMeasureMode

	/**
	 * Whether kilometres are available for selection.
	 * @defaultValue `true`
	 */
	kilometres?: boolean

	/**
	 * Whether hectares are available for selection.
	 * @defaultValue `true`
	 */
	metres?: boolean
}

export interface DrawMetaService {
	id: string
	aggregationMode?: DrawMetaServiceAggregationMode
	propertyNames?: string[]
}

export interface DrawRevisionOptions {
	autofix?: boolean
	metaServices?: DrawMetaService[]
	validate?: boolean
}

export interface DrawLasso {
	/**
	 * ID of the layer to lasso from. The layer must be a vector layer from the
	 * service register.
	 */
	id: string

	/**
	 * If given, the lasso will only be active when minimally this zoom level is
	 * used. This is to prevent overly copying geometries from layers with many
	 * geometries that may not load on the current zoom level.
	 * @defaultValue `undefined`
	 */
	minZoom?: number
}

export interface DrawFontStyle {
	family: string
	size: number[]
}

export interface DrawTextStyle {
	font?: string | DrawFontStyle
	textColor?: string
}

export interface DrawStyleConfiguration {
	[key: string]: unknown
}

export interface DrawSavingConfiguration {
	[key: string]: unknown
}

export interface DrawLayer {
	/**
	 * »configuration that fits wfs-t saving if coleurs« (must match properties to design somehow, not to be implemented in first iteration since how styling is saved in a WFS-T may wildly differ; if we can/should define it, use what's described further down in `style`)
	 * TODO: Oops, I'm pretty sure there's more to this.
	 */
	enableDrawOptions?: boolean | DrawStyleConfiguration

	/**
	 * ID of the layer to work on.
	 * If this ID is contained in the services register, that layer must be
	 * a vector layer, and its features will be worked on.
	 * If this ID is not contained in the services register, a new vector layer
	 * with this ID will be created.
	 * If no ID is given, an ID will be generated that fits the prior case.
	 * @defaultValue A custom ID will be created
	 */
	id?: string

	/**
	 * Lassos allow the user to copy geometries from other layers onto the
	 * currently chosen draw layer.
	 * @defaultValue `undefined`
	 */
	lassos?: DrawLasso[]
	measureOptions?: DrawMeasureOptions

	/**
	 * Display name for layer. This is only used when multiple draw layers exist,
	 * and is used to offer the user to choose between them.
	 * @defaultValue Arbitrary name based on `id`
	 */
	name?: string

	/**
	 * TODO: what
	 */
	revision?: DrawRevisionOptions

	/**
	 * TODO: what
	 */
	saving?: DrawSavingConfiguration

	/**
	 * TODO: what
	 */
	selectableDrawModes?: DrawMode[]

	/**
	 * Which layers to snap to when drawing. Entries must be IDs of vector layers
	 * in the service register.
	 * @defaultValue `[]`
	 */
	snapTo?: string[]

	/**
	 * TODO: what
	 */
	style?: DrawStyleConfiguration

	/**
	 * TODO: what
	 */
	textStyle?: DrawTextStyle
}

/**
 * Plugin options for draw plugin.
 */
export interface DrawPluginOptions extends PluginOptions {
	/**
	 * TODO: determine default value
	 * @defaultValue []
	 */
	layers: DrawLayer[]

	/**
	 * Shows a loader during saving and loading.
	 * @defaultValue true
	 */
	showLoader?: boolean

	/**
	 * Shows toast messages for effects.
	 * @defaultValue true
	 */
	showToasts?: boolean
}

/** TODO: NOT SURE WHAT'S UP HERE */
export interface PolarCircleStyle {
	radius: number
	displacement?: number[]
	fillColor?: Color | ColorLike
	rotation?: number
	scale?: number | Size
	strokeColor?: Color | ColorLike
}

export interface DrawStyle {
	circle: PolarCircleStyle
	fill: Fill
	stroke: Stroke
	measure?: TextOptions
}

export interface TextStyle {
	font: string | FontStyle
	textColor?: Color | ColorLike
}

export interface FontStyle {
	family: string
	size: number[]
}

export type MeasureMode = 'none' | 'metres' | 'kilometres' | 'hectares'

export interface MeasureOptions {
	hectares?: boolean
	initialOption?: MeasureMode
	kilometres?: boolean
	metres?: boolean
}

export interface Lasso {
	id: string
	minZoom: boolean
}

export interface DrawConfiguration extends Partial<PluginOptions> {
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

export type GeometryType = Exclude<Geometry, GeometryCollection>

// The options that can be given to an ol/VectorLayer. Somehow the direct import from ol doesn't work.
// This is a copy with the things that we currently use
export interface PolarVectorOptions {
	source?: VectorSource
	style?: StyleLike
}

export type Mode =
	| 'none'
	| 'draw'
	| 'edit'
	| 'translate'
	| 'delete'
	| 'lasso'
	| 'duplicate'
	| 'merge'
	| 'cut'

export interface CreateInteractionsPayload {
	drawLayer: VectorLayer
	drawSource: VectorSource
}

export interface DrawState {
	drawMode: DrawMode
	featureCollection: FeatureCollection
	featureCollectionRevisionState:
		| typeof inactive
		| typeof inProgress
		| typeof complete
		| typeof error
	measureMode: MeasureMode

	mode: Mode
	revisedFeatureCollection: FeatureCollection
	selectedFeature: number

	/* index in array of available sizes */
	selectedSize: number
	selectedStrokeColor: string
	textInput: string
}

export interface DrawGetters extends Omit<DrawState, 'selectedFeature'> {
	activeLassoIds: string[]
	configuration: DrawConfiguration
	drawSource: VectorSource
	fontSizes: number[]
	measureOptions: MeasureOptions
	selectableDrawModes: { [k in DrawMode]?: string }
	selectableMeasureModes: { [k in MeasureMode]?: string }
	selectableModes: { [k in Mode]: string }
	selectedFeature: Feature
	showDrawOptions: boolean

	showMeasureOptions: boolean
	showSizeSlider: boolean
	showTextInput: boolean

	/* actual text size to use */
	textSize: number
	toastAction: string
}

/*
export interface DrawMutations extends MutationTree<DrawState> {
	setDrawMode: Mutation<DrawState>
	setMode: Mutation<DrawState>
	updateFeatures: Mutation<DrawState>
} */

/** TODO: end of NOT SURE WHAT'S UP HERE section */
