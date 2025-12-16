import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'
import type { PluginOptions } from '@/core'
import type { QueryParameters } from '@/lib/getFeatures/types'

export const PluginId = 'addressSearch'

export interface AddressSearchOptions extends PluginOptions {
	/** Configured search methods. */
	searchMethods: SearchMethodConfiguration[]

	/** Additional search methods (client-side injection). */
	customSearchMethods?: Record<string, SearchMethodFunction>

	/**
	 * Minimal input length before the search starts.
	 *
	 * @defaultValue 0
	 */
	minLength?: number

	/**
	 * Time passed in milliseconds before another search is started.
	 *
	 * @defaultValue 0
	 */
	waitMs?: number
}

/** Possible search methods by type. */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type SearchType = 'bkg' | 'wfs' | 'mpapi' | string

export type SearchDisplayMode = 'mixed' | 'categorized'

/** Object containing information for a specific search method */
export interface SearchMethodConfiguration {
	type: SearchType
	url: string
	categoryId?: string
	hint?: string
	label?: string
	placeholder?: string
	queryParameters?: QueryParameters
}

export type SearchMethodFunction = (
	signal: AbortSignal,
	url: SearchMethodConfiguration['url'],
	inputValue: string,
	queryParameters: SearchMethodConfiguration['queryParameters']
) => Promise<PolarFeatureCollection> | never

export interface SearchResult {
	categoryId: string
	categoryLabel: string
	features: PolarFeatureCollection
}

type PolarFeatureCollection = FeatureCollection<
	Geometry,
	GeoJsonProperties & { title: string }
>
