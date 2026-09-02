import type { Feature as GeoJsonFeature } from 'geojson'
import type { Map } from 'ol'
import type { LayerConfiguration } from '@/core'
import type {
	GfiLayerConfiguration,
	GfiPluginOptions,
	RequestGfiParameters,
} from '../types'

import { rawLayerList } from '@masterportal/masterportalapi'

import { findLayer } from '@/lib/findLayer'

import { requestGfi } from './requestGfi'

export const retrieveFeaturesForCoordinateOrExtentOnConfiguredLayers = async (
	map: Map,
	coreLayers: LayerConfiguration[],
	gfiLayers: Record<string, GfiLayerConfiguration>,
	mode: GfiPluginOptions['mode'],
	maxFeatures: GfiPluginOptions['maxFeatures'],
	coordinateOrExtent: RequestGfiParameters['coordinateOrExtent']
): Promise<Record<string, GeoJsonFeature[]>> => {
	return Object.fromEntries(
		(
			await Promise.all(
				Object.entries(gfiLayers)
					.map(([layerId, layerConfiguration]) => ({
						layerId,
						layerConfiguration,
						layer: findLayer(map, layerId),
					}))
					.filter(
						(
							layer
						): layer is {
							[K in keyof typeof layer]: NonNullable<(typeof layer)[K]>
						} => Boolean(layer.layer)
					)
					.map(async ({ layerId, layer, layerConfiguration }) => {
						return [
							layerId,
							(
								await requestGfi({
									coordinateOrExtent,
									layer,
									layerConfiguration,
									layerSpecification: rawLayerList.getLayerWhere({
										id: layerId,
									}),
									map,
									mode:
										coreLayers.find((layer) => layer.id === layerId)?.gfiMode ||
										mode ||
										'bboxDot',
								})
							)
								.filter(
									(feature) =>
										!layerConfiguration.isSelectable ||
										layerConfiguration.isSelectable(feature)
								)
								.slice(
									0,
									layerConfiguration.maxFeatures ?? Number.POSITIVE_INFINITY
								),
						]
					})
			)
		)
			.filter((it): it is GeoJsonFeature[][] => Boolean(it))
			.slice(0, maxFeatures ?? Number.POSITIVE_INFINITY)
	)
}
