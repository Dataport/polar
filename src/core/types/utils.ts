import type {
	Feature,
	GeoJsonObject,
	GeoJsonProperties,
	Geometry,
} from 'geojson'

/**
 * Copied from https://stackoverflow.com/a/54178819.
 *
 * Makes the properties defined by type `K` optional in type `T`.
 *
 * @example `PartialBy<LayerConfiguration, 'id' | 'name'>`
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type UsedGeometry = Exclude<Geometry, 'GeometryCollection'>

export interface PolarFeature<
	G extends UsedGeometry | null = UsedGeometry,
	P = GeoJsonProperties,
> extends Omit<Feature<G, P>, 'type'> {
	title: string
	type: 'Feature' | 'reverse_geocoded'
}

export interface PolarFeatureCollection<
	G extends UsedGeometry | null = UsedGeometry,
	P = GeoJsonProperties,
> extends GeoJsonObject {
	features: Array<PolarFeature<G, P>>
	type: 'FeatureCollection'
}
