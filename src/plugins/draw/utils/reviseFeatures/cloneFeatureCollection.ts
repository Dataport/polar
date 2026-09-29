import type { FeatureCollection } from 'geojson'
import type { GeometryType } from '../../types'

// FeatureCollection is compatible to gangsta clone
export const cloneFeatureCollection = (
	// No GeometryCollection from Draw, hence the <GeometryType>
	featureCollection: FeatureCollection<GeometryType>
): FeatureCollection<GeometryType> =>
	JSON.parse(JSON.stringify(featureCollection))
