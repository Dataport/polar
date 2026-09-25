import type { FeatureCollection, Feature as GeoJsonFeature } from 'geojson'
import type { Feature, Map } from 'ol'
import type { DrawPluginOptionsMetaService, GeometryType } from '../../types'

import { rawLayerList } from '@masterportal/masterportalapi'
import { booleanIntersects } from '@turf/turf'
import { isEqual } from 'es-toolkit'
import { GeoJSON } from 'ol/format'

import { getVectorFeaturesByFeatureRequest } from '@/lib/getFeatures/vector'
import { parseWfsResponse } from '@/lib/getFeatures/wfs/parse'

const reader = new GeoJSON()

type Aggregator = (
	propertiesArray: Exclude<GeoJsonFeature['properties'], null>[]
) => GeoJsonFeature['properties'][] | GeoJsonFeature['properties']

const aggregators: Record<
	Required<DrawPluginOptionsMetaService>['aggregationMode'],
	Aggregator
> = {
	all: (x) => x,
	unequal: (propertiesArray) =>
		propertiesArray.reduce((accumulator, current) => {
			if (accumulator.every((entry) => !isEqual(entry, current))) {
				accumulator.push(current)
			}
			return accumulator
		}, []),
}

const filterProperties = (
	properties: Exclude<GeoJsonFeature['properties'], null>,
	propertyNames?: string[]
) =>
	propertyNames && propertyNames.length
		? Object.fromEntries(
				Object.entries(properties).filter(([key]) =>
					propertyNames.includes(key)
				)
			)
		: properties

const aggregateProperties = (
	propertiesArray: GeoJsonFeature['properties'][],
	propertyNames?: string[],
	mode: DrawPluginOptionsMetaService['aggregationMode'] = 'unequal'
) =>
	aggregators[mode](
		propertiesArray
			.filter((properties) => properties !== null)
			.map((properties) => filterProperties(properties, propertyNames))
	)

/** @throws */
export const enrichWithMetaServices = (
	featureCollection: FeatureCollection<GeometryType>,
	map: Map,
	metaServices: DrawPluginOptionsMetaService[],
	signal: AbortSignal
): Promise<GeoJsonFeature<GeometryType>[]> =>
	Promise.all(
		featureCollection.features.map(async (feature) => ({
			...feature,
			properties: {
				...feature.properties,
				metaProperties: {
					...(feature.properties?.metaProperties || {}),
					...Object.fromEntries(
						await Promise.all(
							metaServices.map(({ id, propertyNames, aggregationMode }) =>
								getVectorFeaturesByFeatureRequest(
									signal,
									reader.readFeature(
										JSON.stringify(feature)
									) as unknown as Feature,
									id,
									map.getView().getProjection().getCode()
								)
									.then((response) =>
										rawLayerList.getLayerWhere({ id }).typ === 'WFS'
											? (parseWfsResponse(
													response,
													undefined,
													false,
													map.getView().getProjection().getCode()
												) as Promise<FeatureCollection>)
											: (response.json() as Promise<FeatureCollection>)
									)
									.then((featuresFromBbox) => {
										const applicableProperties = featuresFromBbox.features
											.filter((featureFromBbox) =>
												booleanIntersects(featureFromBbox, feature)
											)
											.map(({ properties }) => properties)
										const aggregatedProperties = aggregateProperties(
											applicableProperties,
											propertyNames,
											aggregationMode
										)
										return [id, aggregatedProperties]
									})
							)
						)
					),
				},
			},
		}))
	)
