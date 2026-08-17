import type { FeatureCollection } from 'geojson'
import type { GeometryType } from '../../types'

import { booleanValid } from '@turf/turf'

export const validateGeoJson = (
	featureCollection: FeatureCollection<GeometryType>
): FeatureCollection<GeometryType> => ({
	...featureCollection,
	features: featureCollection.features.map((feature) => ({
		...feature,
		properties: {
			...(feature.properties ?? {}),
			sfaValidity: booleanValid(feature),
		},
	})),
})
