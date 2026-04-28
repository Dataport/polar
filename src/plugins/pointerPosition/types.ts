import type { PluginOptions } from '@/core'

export const PluginId = 'pointerPosition'

export interface PointerPositionProjection {
	/**
	 * Configured codes must be defined via the core's configuration field
	 * {@link MasterportalApiConfiguration.namedProjections | `mapConfiguration.namedProjections`} or its default value.
	 */
	code: `EPSG:${string}`

	/**
	 * Decimal count to be displayed for the projection.
	 *
	 * @defaultValue 4
	 */
	decimals?: number
}

export interface PointerPositionPluginOptions extends PluginOptions {
	/**
	 * List of which projections from the {@link MasterportalApiConfiguration.namedProjections | mapConfiguration.namedProjections} to
	 * use, i.e., only a subset can be chosen here. If not given, all EPSG
	 * systems configured in `namedProjections` will be chosen. In both cases,
	 * the coordinate reference system that is first in the list will be used
	 * as initial selection. If only one system is available, the selection
	 * element will be omitted.
	 */
	projections?: PointerPositionProjection[]
}
