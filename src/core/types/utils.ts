import type {
	Feature,
	GeoJsonObject,
	GeoJsonProperties,
	Geometry,
	GeometryCollection,
} from 'geojson'

/**
 * Copied from https://stackoverflow.com/a/54178819.
 *
 * Makes the properties defined by type `K` optional in type `T`.
 *
 * @example `PartialBy<LayerConfiguration, 'id' | 'name'>`
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type UsedGeometry = Exclude<Geometry, GeometryCollection>

export interface PolarGeoJsonFeature<
	G extends UsedGeometry | null = UsedGeometry,
	P = GeoJsonProperties,
> extends Omit<Feature<G, P>, 'type'> {
	/** A fieldName to use for display purposes. */
	title: string
	type: 'Feature' | 'reverse_geocoded'
}

export interface PolarGeoJsonFeatureCollection<
	G extends UsedGeometry | null = UsedGeometry,
	P = GeoJsonProperties,
> extends GeoJsonObject {
	features: Array<PolarGeoJsonFeature<G, P>>
	type: 'FeatureCollection'
}
