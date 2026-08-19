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
		route.value.forEach((coordinate) => {
			if (coordinate.length) {
				markerSource.addFeature(
					new Feature({
						geometry: new Point(coordinate),
					})
				)
			}
		})
	})

	const modify = new Modify({ source: markerSource })
	modify.on('modifyend', (evt) => {
		const allFeatures = markerSource.getFeatures()
		evt.features.forEach((feature) => {
			const geometry = feature.getGeometry()
			if (geometry instanceof Point) {
				const index = allFeatures.indexOf(feature)
				if (index !== -1 && index < route.value.length) {
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
		let markerSource: {
			addFeature: ReturnType<typeof vi.fn>
			clear: ReturnType<typeof vi.fn>
			getFeature: ReturnType<typeof vi.fn>
			getFeatures: ReturnType<typeof vi.fn>
		}
		let map: {
			addLayer: ReturnType<typeof vi.fn>
			removeLayer: ReturnType<typeof vi.fn>
			addInteraction: ReturnType<typeof vi.fn>
			on: ReturnType<typeof vi.fn>
			hasFeatureAtPixel: ReturnType<typeof vi.fn>
			getEventPixel: ReturnType<typeof vi.fn>
			getTargetElement: ReturnType<typeof vi.fn>
		}
		let mapElement: { style: { cursor: string } }

		beforeEach(() => {
			route = ref<Coordinate[]>([])
			mapElement = { style: { cursor: '' } }
			markerSource = {
				addFeature: vi.fn(),
				clear: vi.fn(),
				getFeature: vi.fn(),
				getFeatures: vi.fn().mockReturnValue([{ id: 1 }]),
			}
			map = {
				addLayer: vi.fn(),
				removeLayer: vi.fn(),
				addInteraction: vi.fn(),
				on: vi.fn(),
				hasFeatureAtPixel: vi.fn().mockReturnValue(false),
				getEventPixel: vi.fn().mockReturnValue([0, 0]),
				getTargetElement: vi.fn().mockReturnValue(mapElement),
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
			expect(markerSource.addFeature).toHaveBeenCalledTimes(2)
			route.value[0] = [2, 5]
			await nextTick()
			expect(markerSource.clear).toHaveBeenCalledOnce()
			scope.stop()
		})

		it('skips empty coordinates when route changes', async () => {
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
			expect(markerSource.addFeature).toHaveBeenCalledOnce()
			route.value[2] = [4, 7]
			route.value[0] = [2, 5]
			await nextTick()
			expect(markerSource.addFeature).toHaveBeenCalledOnce()
			scope.stop()
		})
	})
}
