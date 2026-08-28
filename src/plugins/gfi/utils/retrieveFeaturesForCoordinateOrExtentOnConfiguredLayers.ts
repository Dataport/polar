import type { Feature as GeoJsonFeature } from 'geojson'
import type { RequestGfiParameters } from '../types'

import { rawLayerList } from '@masterportal/masterportalapi'

import { useCoreStore } from '@/core/stores'
import { findLayer } from '@/lib/findLayer'

import { useGfiMainStore } from '../stores/main'
import { requestGfi } from './requestGfi'

export const retrieveFeaturesForCoordinateOrExtentOnConfiguredLayers = async (
	coordinateOrExtent: RequestGfiParameters['coordinateOrExtent']
) => {
	const coreStore = useCoreStore()
	const gfiMainStore = useGfiMainStore()

	return Object.fromEntries(
		(
			await Promise.all(
				Object.entries(gfiMainStore.configuration.layers)
					.map(([layerId, layerConfiguration]) => ({
						layerId,
						layerConfiguration,
						layer: findLayer(coreStore.map, layerId),
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
									map: coreStore.map,
									mode:
										coreStore.configuration.layers.find(
											(layer) => layer.id === layerId
										)?.gfiMode ||
										gfiMainStore.configuration.mode ||
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
									gfiMainStore.configuration.maxFeatures ||
										Number.POSITIVE_INFINITY
								),
						]
					})
			)
		).filter((it): it is GeoJsonFeature[][] => Boolean(it))
	) as Record<string, GeoJsonFeature[]>
}
