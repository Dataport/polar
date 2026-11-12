import type { Coordinate } from 'ol/coordinate'
import type VectorSource from 'ol/source/Vector'
import type { ComputedRef, Ref } from 'vue'
import type { useCoreStore } from '@/core/stores'
import type { RoutingPluginOptions, RoutingResponseData } from '../types'

import { t } from 'i18next'
import { Feature } from 'ol'
import { LineString } from 'ol/geom'
import { transform } from 'ol/proj'
import { computed, ref } from 'vue'

import { PluginId } from '../types'
import { handleErrors } from '../utils/handleErrors'

interface RouteCalculationOptions {
	configuration: ComputedRef<RoutingPluginOptions>
	coreStore: ReturnType<typeof useCoreStore>
	route: Ref<Coordinate[]>
	routeSource: VectorSource
	selectedPreference: Ref<string>
	selectedRouteTypesToAvoid: Ref<string[]>
	selectedTravelMode: Ref<string>
}

export function useRouteCalculation({
	coreStore,
	configuration,
	route,
	routeSource,
	selectedPreference,
	selectedRouteTypesToAvoid,
	selectedTravelMode,
}: RouteCalculationOptions) {
	let abortController: AbortController | null = null
	const routingResponseData = ref<RoutingResponseData | null>(null)

	const routeAsWGS84 = computed(() =>
		route.value
			.filter((coordinate) => coordinate.length > 0)
			.map((coordinate) =>
				transform(
					coordinate,
					coreStore.map.getView().getProjection().getCode(),
					'EPSG:4326'
				)
			)
	)

	const url = computed(
		() => configuration.value.url + selectedTravelMode.value + '/geojson'
	)

	const routeFeature = computed(
		() => routingResponseData.value?.features[0] ?? null
	)

	const showDetails = computed(() => routingResponseData.value !== null)

	async function fetchRoute(signal: AbortSignal): Promise<RoutingResponseData> {
		const response = await fetch(url.value, {
			method: 'POST',
			headers: {
				/* eslint-disable @typescript-eslint/naming-convention */
				'Content-Type': 'application/json',
				...(configuration.value.apiKey && {
					Authorization: configuration.value.apiKey,
				}),
				/* eslint-enable @typescript-eslint/naming-convention */
			},
			body: JSON.stringify({
				coordinates: routeAsWGS84.value,
				geometry: true,
				instructions: true,
				language: coreStore.language,
				options: {
					avoid_features: selectedRouteTypesToAvoid.value,
				},
				preference: selectedPreference.value,
				units: 'm',
			}),
			signal,
		})
		if (!response.ok) {
			throw new Error(
				'Route could not be determined. Try different coordinates.'
			)
		}
		return response.json()
	}

	async function getRoute() {
		routeSource.clear()
		if (abortController) {
			abortController.abort()
		}
		abortController = new AbortController()
		const { signal } = abortController
		try {
			const response = await fetchRoute(signal)
			if (signal.aborted) {
				return
			}
			routingResponseData.value = response

			if (!routeFeature.value) {
				throw new Error(t(($) => $.noFeature, { ns: PluginId }))
			}
			routeSource.addFeature(
				new Feature({
					geometry: new LineString(
						routeFeature.value.geometry.coordinates.map((coordinate) =>
							transform(
								coordinate,
								'EPSG:4326',
								coreStore.map.getView().getProjection().getCode()
							)
						)
					),
				})
			)
		} catch (error) {
			if (!signal.aborted) {
				handleErrors(error)
			}
		}
	}

	function clearRoute() {
		if (abortController) {
			abortController.abort()
			abortController = null
		}
		routeSource.clear()
		routingResponseData.value = null
	}

	return {
		routingResponseData,
		routeFeature,
		showDetails,
		getRoute,
		abortController,
		clearRoute,
	}
}
