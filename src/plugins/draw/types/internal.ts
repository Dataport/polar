import type { Geometry, GeometryCollection } from 'geojson'
import type { Feature as OlFeature } from 'ol'
import type VectorSource from 'ol/source/Vector'
import type { StyleLike } from 'ol/style/Style'
import type { Ref, WritableComputedRef } from 'vue'
import type { DrawTextStyle } from './common'

/**
 * Plugin identifier.
 */
export const PluginId = 'draw'

/**
 * Modes in that the draw plugin can be used.
 */
export const ToolModes = ['draw', 'edit', 'delete'] as const

/**
 * Supported editing modes for edit tool mode.
 * Please mind that `lasso` requires additional plugin configuration to work.
 */
export const EditModes = [
	'modify',
	'translate',
	'duplicate',
	'cut',
	'merge',
	'lasso',
] as const

export const DownloadModes = ['geojson'] as const

export const MeasureModes = [
	'none',
	'metres',
	'kilometres',
	'hectares',
] as const

export type ToolMode = (typeof ToolModes)[number]
export type EditMode = (typeof EditModes)[number]
export type DownloadMode = (typeof DownloadModes)[number]
export type MeasureMode = (typeof MeasureModes)[number]

export interface InteractionOptions {
	drawing: Ref<boolean>
	selectedFeature: WritableComputedRef<OlFeature | null>
	text: {
		textInput: string
		textSize: number
		textStyle: DrawTextStyle
	}
	activeLassoIds?: string[]
	measureMode?: MeasureMode
}

export type GeometryType = Exclude<Geometry, GeometryCollection>

/**
 * The options that can be given to an ol/VectorLayer.
 * TODO: Somehow the direct import from ol doesn't work. This is a copy with the things that we currently use. Fix me if you can.
 */
export interface PolarVectorOptions {
	source?: VectorSource
	style?: StyleLike
}

export const inactive = 'inactive'
export const inProgress = 'inProgress'
export const complete = 'complete'
export const error = 'error'
export type RevisionStateFlag =
	typeof inactive | typeof inProgress | typeof complete | typeof error
