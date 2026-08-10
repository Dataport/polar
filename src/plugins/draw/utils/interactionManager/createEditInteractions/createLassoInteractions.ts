import type {
	Feature as GeoJsonFeature,
	Geometry,
	GeometryCollection,
} from 'geojson'
import type { Feature } from 'ol'
import type { Map } from 'ol'
import type { Polygon } from 'ol/geom'
import type VectorSource from 'ol/source/Vector'
import type { PolarGeoJsonFeature, PolarGeoJsonFeatureCollection } from '@/core'

import { rawLayerList } from '@masterportal/masterportalapi'
import { booleanContains } from '@turf/boolean-contains'
import { GeoJSON } from 'ol/format'
import Draw from 'ol/interaction/Draw'

import { getVectorFeaturesByFeatureRequest } from '@/lib/getFeatures/vector'
import { parseWfsResponse } from '@/lib/getFeatures/wfs/parse'
import { indicateLoading } from '@/lib/indicateLoading'
import { notifyUser } from '@/lib/notifyUser'

const requestError = 'An error occurred on creating the lasso request: '
const rejectedError = 'The response to a lasso request indicated an error.'
const parseError = 'Client failure in reading responses in lasso action.'

const buildFeatureCollection = (
	featureCollections: PolarGeoJsonFeatureCollection[],
	drawnLasso: Feature
) => {
	const drawnLassoGeoJson = JSON.parse(new GeoJSON().writeFeature(drawnLasso))

	return {
		type: 'FeatureCollection',
		features: featureCollections
			.reduce<PolarGeoJsonFeature[]>(
				(accumulator, { features }) => accumulator.concat(features),
				[]
			)
			.filter((feature) => {
				if (feature.geometry.type.startsWith('Multi')) {
					return (
						// since .type on GeometryCollection doesn't start with 'Multi'
						(
							feature.geometry as Exclude<Geometry, GeometryCollection>
						).coordinates.every((partialCoordinates) =>
							booleanContains(drawnLassoGeoJson, {
								type: 'Feature',
								geometry: {
									type: feature.geometry.type.slice(5), // un«Multi»ed
									coordinates: partialCoordinates,
								},
								properties: {},
							})
						)
					)
				}
				return booleanContains(drawnLassoGeoJson, feature as GeoJsonFeature)
			}),
	}
}

export function createLassoInteractions(
	map: Map,
	drawSource: VectorSource,
	activeLassoIds: string[]
): Draw {
	const draw = new Draw({ type: 'Polygon', freehand: true })

	draw.on('drawend', (e) => {
		const drawnLasso = e.feature as Feature<Polygon> // due to Draw 'type' param
		const requests = activeLassoIds.reduce<Promise<Response>[]>(
			(accumulator, id) => {
				try {
					const request = getVectorFeaturesByFeatureRequest(
						null,
						drawnLasso,
						id,
						map.getView().getProjection().getCode()
					)
					accumulator.push(request)
				} catch (e) {
					console.error(requestError, e)
					notifyUser('error', 'plugins.draw.lasso.internalError')
				}
				return accumulator
			},
			[]
		)

		let done = false
		let unindicateLoading: (() => void) | undefined
		setTimeout(() => !done && (unindicateLoading = indicateLoading()), 100)

		Promise.allSettled(requests)
			.then((settledRequests) =>
				Promise.all(
					(
						settledRequests.filter((promiseSettledResult) => {
							if (promiseSettledResult.status === 'rejected') {
								console.error(rejectedError, promiseSettledResult.reason)
								notifyUser('error', 'plugins.draw.lasso.layerRejected')
								return false
							}
							return true
						}) as PromiseFulfilledResult<Response>[]
					).map(async (result, index) =>
						rawLayerList.getLayerWhere({ id: activeLassoIds[index] }).typ ===
						'WFS'
							? await parseWfsResponse(
									result.value,
									undefined,
									false,
									map.getView().getProjection().getCode()
								)
							: ((await result.value.json()) as PolarGeoJsonFeatureCollection)
					)
				)
			)
			.then((featureCollections) => {
				const featureCollection = buildFeatureCollection(
					featureCollections,
					drawnLasso
				)
				const olFeatures = new GeoJSON().readFeatures(featureCollection, {
					dataProjection: map.getView().getProjection().getCode(),
					featureProjection: map.getView().getProjection().getCode(),
				})
				drawSource.addFeatures(olFeatures)
			})
			.catch((error: unknown) => {
				console.error(parseError, error)
				notifyUser('error', 'plugins.draw.lasso.internalError')
			})
			.finally(() => {
				done = true
				unindicateLoading?.()
			})
	})

	return draw
}
