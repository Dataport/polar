import type { Feature as GeoJsonFeature } from 'geojson'
import type { Feature } from 'ol'

import { GeoJSON } from 'ol/format'

const writer = new GeoJSON()

/**
 * Convert an OpenLayers feature to a GeoJSON feature.
 */
export function serializeFeature(feature: Feature): GeoJsonFeature {
	return writer.writeFeatureObject(feature)
}
