import type { Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type VectorSource from 'ol/source/Vector'
import type { Ref } from 'vue'

import { Feature } from 'ol'
import { Point } from 'ol/geom'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { onScopeDispose, watch } from 'vue'

export function useMarkerLayer(
	map: Map,
	markerSource: VectorSource,
	route: Ref<Coordinate[]>
) {
	const layer = new VectorLayer({
		source: markerSource,
		style: new Style({
			image: new Circle({
				radius: 6,
				fill: new Fill({ color: '#1E90FF' }),
				stroke: new Stroke({ color: 'white', width: 2 }),
			}),
		}),
	})

	map.addLayer(layer)
	onScopeDispose(() => {
		map.removeLayer(layer)
	})

	watch(route, () => {
		markerSource.clear()
		route.value.forEach((coordinate, index) => {
			if (coordinate.length) {
				markerSource.addFeature(
					new Feature({
						geometry: new Point(coordinate),
						routeIndex: index,
					})
				)
			}
		})
	})

	const modify = new Modify({ source: markerSource })
	modify.on('modifyend', (evt) => {
		evt.features.forEach((feature) => {
			const geometry = feature.getGeometry()
			if (geometry instanceof Point) {
				const index = feature.get('routeIndex')
				if (index < route.value.length && typeof index === 'number') {
					route.value[index] = geometry.getCoordinates()
				}
			}
		})
	})

	map.on('pointermove', (evt) => {
		const pixel = map.getEventPixel(evt.originalEvent)
		const hit = map.hasFeatureAtPixel(pixel)
		if (
			'buttons' in evt.originalEvent &&
			(evt.originalEvent as PointerEvent).buttons === 1 &&
			hit
		) {
			map.getTargetElement().style.cursor = 'grabbing'
		} else {
			map.getTargetElement().style.cursor = hit ? 'grab' : ''
		}
	})

	map.addInteraction(modify)
}

if (import.meta.vitest) {
	const { default: VectorSource } = await import('ol/source/Vector')
	const { describe, it, beforeEach, afterEach, vi, expect } = import.meta.vitest
	const { effectScope, ref, nextTick } = await import('vue')

	vi.mock('ol/interaction/Modify', () => ({
		default: vi.fn().mockImplementation(function (this: {
			on: ReturnType<typeof vi.fn>
		}) {
			this.on = vi.fn()
		}),
	}))

	vi.mock('ol/layer/Vector', () => ({
		default: vi.fn().mockImplementation(function () {}),
	}))

	describe('useMarkerLayer', () => {
		let route: Ref<Coordinate[]>
		let map: {
			addLayer: ReturnType<typeof vi.fn>
			removeLayer: ReturnType<typeof vi.fn>
			addInteraction: ReturnType<typeof vi.fn>
			on: ReturnType<typeof vi.fn>
		}
		let markerSource: VectorSource

		beforeEach(() => {
			route = ref<Coordinate[]>([])
			markerSource = new VectorSource()
			map = {
				addLayer: vi.fn(),
				removeLayer: vi.fn(),
				addInteraction: vi.fn(),
				on: vi.fn(),
			}
		})

		afterEach(() => {
			vi.clearAllMocks()
		})

		it('should check if the layer has been added to the map', () => {
			const scope = effectScope()
			scope.run(() => {
				useMarkerLayer(
					map as unknown as Map,
					markerSource as unknown as VectorSource,
					route
				)
			})

			expect(map.addLayer).toHaveBeenCalledOnce()

			scope.stop()
		})

		it('should check whether modify interaction has been added to the map', () => {
			const scope = effectScope()
			scope.run(() => {
				useMarkerLayer(
					map as unknown as Map,
					markerSource as unknown as VectorSource,
					route
				)
			})

			expect(map.addInteraction).toHaveBeenCalledOnce()

			scope.stop()
		})

		it('should check if the layer has been removed from the map on scope disposal', () => {
			const scope = effectScope()
			scope.run(() => {
				useMarkerLayer(
					map as unknown as Map,
					markerSource as unknown as VectorSource,
					route
				)
			})

			expect(map.removeLayer).not.toHaveBeenCalled()
			scope.stop()
			expect(map.removeLayer).toHaveBeenCalledOnce()
		})

		it('clears and fills markerSource when route changes', async () => {
			const addFeatureSpy = vi.spyOn(markerSource, 'addFeature')
			const clearSpy = vi.spyOn(markerSource, 'clear')
			const scope = effectScope()
			scope.run(() => {
				useMarkerLayer(
					map as unknown as Map,
					markerSource as unknown as VectorSource,
					route
				)
			})
			route.value = [
				[1, 2],
				[3, 4],
			]
			await nextTick()
			expect(addFeatureSpy).toHaveBeenCalledTimes(2)
			route.value = [
				[2, 5],
				[3, 4],
			]
			await nextTick()
			expect(clearSpy).toHaveBeenCalledTimes(2)
			expect(addFeatureSpy).toHaveBeenCalledTimes(4)
			scope.stop()
		})

		it('skips empty coordinates when route changes', async () => {
			const addFeatureSpy = vi.spyOn(markerSource, 'addFeature')
			const scope = effectScope()
			scope.run(() => {
				useMarkerLayer(
					map as unknown as Map,
					markerSource as unknown as VectorSource,
					route
				)
			})

			route.value = [[1, 2], []]
			await nextTick()
			expect(addFeatureSpy).toHaveBeenCalledOnce()
			route.value = [[2, 5], [], [4, 7]]
			await nextTick()
			expect(addFeatureSpy).toHaveBeenCalledTimes(3)
			scope.stop()
		})
	})
}
