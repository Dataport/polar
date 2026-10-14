import type { Map, MapBrowserEvent } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type VectorSource from 'ol/source/Vector'
import type { MaybeRefOrGetter, Ref } from 'vue'

import { Feature } from 'ol'
import { Point } from 'ol/geom'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { onScopeDispose, toValue, watch } from 'vue'

/**
 * Adds a layer displaying the route markers and allows modifying them.
 *
 * @param modifyActive - Whether markers may currently be modified, e.g. `false`
 * while another interaction is masking clicks.
 */
export function useMarkerLayer(
	map: Map,
	markerSource: VectorSource,
	route: Ref<Coordinate[]>,
	modifyActive: MaybeRefOrGetter<boolean>,
	onMarkerMoved: (index: number, coordinate: Coordinate) => void
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
				if (
					typeof index === 'number' &&
					index >= 0 &&
					index < route.value.length
				) {
					onMarkerMoved(index, geometry.getCoordinates())
				}
			}
		})
	})

	function onPointerMove(evt: MapBrowserEvent) {
		const pixel = map.getEventPixel(evt.originalEvent)
		const hit = modify.getActive() && map.hasFeatureAtPixel(pixel)
		if (
			'buttons' in evt.originalEvent &&
			(evt.originalEvent as PointerEvent).buttons === 1 &&
			hit
		) {
			map.getTargetElement().style.cursor = 'grabbing'
		} else {
			map.getTargetElement().style.cursor = hit ? 'grab' : ''
		}
	}
	map.on('pointermove', onPointerMove)

	map.addInteraction(modify)
	watch(
		() => toValue(modifyActive),
		(active) => {
			modify.setActive(active)
		},
		{ immediate: true }
	)

	onScopeDispose(() => {
		map.un('pointermove', onPointerMove)
		map.removeInteraction(modify)
		map.removeLayer(layer)
		map.getTargetElement().style.cursor = ''
	})
}

if (import.meta.vitest) {
	const { default: VectorSource } = await import('ol/source/Vector')
	const { describe, it, beforeEach, afterEach, vi, expect } = import.meta.vitest
	const { effectScope, ref, nextTick } = await import('vue')

	vi.mock('ol/interaction/Modify', () => ({
		default: vi.fn().mockImplementation(function (this: {
			on: ReturnType<typeof vi.fn>
			active: boolean
			getActive: ReturnType<typeof vi.fn>
			setActive: ReturnType<typeof vi.fn>
		}) {
			this.on = vi.fn()
			this.active = true
			this.getActive = vi.fn(() => this.active)
			this.setActive = vi.fn((active: boolean) => {
				this.active = active
			})
		}),
	}))

	describe('useMarkerLayer', () => {
		let route: Ref<Coordinate[]>
		let modifyActive: Ref<boolean>
		let onMarkerMoved: (index: number, coordinate: Coordinate) => void
		let map: {
			addLayer: ReturnType<typeof vi.fn>
			removeLayer: ReturnType<typeof vi.fn>
			addInteraction: ReturnType<typeof vi.fn>
			removeInteraction: ReturnType<typeof vi.fn>
			on: ReturnType<typeof vi.fn>
			un: ReturnType<typeof vi.fn>
			getEventPixel: ReturnType<typeof vi.fn>
			hasFeatureAtPixel: ReturnType<typeof vi.fn>
			getTargetElement: ReturnType<typeof vi.fn>
		}
		let markerSource: VectorSource
		let targetElement: { style: { cursor: string } }
		let scope: ReturnType<typeof effectScope> | undefined

		beforeEach(() => {
			route = ref<Coordinate[]>([])
			modifyActive = ref(true)
			onMarkerMoved = vi.fn<(index: number, coordinate: Coordinate) => void>()
			markerSource = new VectorSource()
			targetElement = { style: { cursor: '' } }
			map = {
				addLayer: vi.fn(),
				removeLayer: vi.fn(),
				addInteraction: vi.fn(),
				removeInteraction: vi.fn(),
				on: vi.fn(),
				un: vi.fn(),
				getEventPixel: vi.fn(),
				hasFeatureAtPixel: vi.fn(),
				getTargetElement: vi.fn(() => targetElement),
			}
		})

		afterEach(() => {
			scope?.stop()
			vi.clearAllMocks()
		})

		const run = () => {
			const currentScope = effectScope()
			currentScope.run(() => {
				useMarkerLayer(
					map as unknown as Map,
					markerSource,
					route,
					modifyActive,
					onMarkerMoved
				)
			})
			scope = currentScope
			return currentScope
		}

		const getModify = () =>
			map.addInteraction.mock.calls[0]?.[0] as {
				on: ReturnType<typeof vi.fn>
				setActive: ReturnType<typeof vi.fn>
				getActive: ReturnType<typeof vi.fn>
			}

		const getPointerMove = () =>
			map.on.mock.calls.find(
				(call) => call[0] === 'pointermove'
			)?.[1] as (event: { originalEvent: { buttons?: number } }) => void

		it('adds the layer to the map', () => {
			run()

			expect(map.addLayer).toHaveBeenCalledOnce()
			const layer = map.addLayer.mock.calls[0]?.[0] as VectorLayer
			expect(layer.getSource()).toBe(markerSource)
			expect(layer.getStyle()).toBeInstanceOf(Style)
		})

		it('removes the layer, interaction and listener on scope disposal', () => {
			const scope = run()
			const modify = getModify()
			const pointerMove = getPointerMove()
			targetElement.style.cursor = 'grab'

			expect(map.removeLayer).not.toHaveBeenCalled()
			expect(map.removeInteraction).not.toHaveBeenCalled()
			expect(map.un).not.toHaveBeenCalled()
			scope.stop()
			expect(map.removeLayer).toHaveBeenCalledExactlyOnceWith(
				map.addLayer.mock.calls[0]?.[0]
			)
			expect(map.removeInteraction).toHaveBeenCalledExactlyOnceWith(modify)
			expect(map.un).toHaveBeenCalledExactlyOnceWith('pointermove', pointerMove)
			expect(targetElement.style.cursor).toBe('')
		})

		it('toggles the modify interaction depending on modifyActive', async () => {
			run()
			const modify = getModify()
			expect(modify.setActive).toHaveBeenLastCalledWith(true)

			modifyActive.value = false
			await nextTick()
			expect(modify.setActive).toHaveBeenLastCalledWith(false)

			modifyActive.value = true
			await nextTick()
			expect(modify.setActive).toHaveBeenLastCalledWith(true)
		})

		it('does not set a grab cursor while modify is inactive', async () => {
			modifyActive.value = false
			run()
			await nextTick()
			map.getEventPixel.mockReturnValue([0, 0])
			map.hasFeatureAtPixel.mockReturnValue(true)

			getPointerMove()({ originalEvent: {} })
			expect(targetElement.style.cursor).toBe('')
			getPointerMove()({ originalEvent: { buttons: 1 } })
			expect(targetElement.style.cursor).toBe('')
		})

		it('clears and fills markerSource when route changes', async () => {
			const addFeatureSpy = vi.spyOn(markerSource, 'addFeature')
			const clearSpy = vi.spyOn(markerSource, 'clear')
			run()
			route.value = [
				[1, 2],
				[3, 4],
			]
			await nextTick()
			expect(
				markerSource.getFeatures().map((feature) => ({
					coordinate: (feature.getGeometry() as Point).getCoordinates(),
					index: feature.get('routeIndex'),
				}))
			).toEqual([
				{ coordinate: [1, 2], index: 0 },
				{ coordinate: [3, 4], index: 1 },
			])
			expect(clearSpy).toHaveBeenCalledOnce()
			expect(addFeatureSpy).toHaveBeenCalledTimes(2)
		})

		it('skips empty coordinates when route changes', async () => {
			const addFeatureSpy = vi.spyOn(markerSource, 'addFeature')
			run()

			route.value = [[1, 2], []]
			await nextTick()
			expect(addFeatureSpy).toHaveBeenCalledOnce()
			expect(markerSource.getFeatures()).toHaveLength(1)
			const firstFeature = markerSource.getFeatures()[0] as Feature
			expect((firstFeature.getGeometry() as Point).getCoordinates()).toEqual([
				1, 2,
			])
			route.value = [[2, 5], [], [4, 7]]
			await nextTick()
			expect(addFeatureSpy).toHaveBeenCalledTimes(3)
			expect(markerSource.getFeatures()).toHaveLength(2)
			expect(
				markerSource
					.getFeatures()
					.map((feature) => (feature.getGeometry() as Point).getCoordinates())
			).toEqual([
				[2, 5],
				[4, 7],
			])
		})

		it.each([
			{
				description: 'calls the callback for a valid marker index',
				routeIndex: 1,
				expectedCall: [[10, 20]],
			},
			{
				description: 'does not call the callback for an invalid marker index',
				routeIndex: 2,
				expectedCall: undefined,
			},
		])('$description', ({ routeIndex, expectedCall }) => {
			run()
			route.value = [
				[1, 2],
				[3, 4],
			]
			const modify = map.addInteraction.mock.calls[0]?.[0] as {
				on: ReturnType<typeof vi.fn>
			}
			const modifyEnd = modify.on.mock.calls.find(
				(call) => call[0] === 'modifyend'
			)?.[1] as (event: { features: Feature[] }) => void
			const modifiedFeature = new Feature({
				geometry: new Point([10, 20]),
				routeIndex,
			})

			modifyEnd({ features: [modifiedFeature] })

			if (expectedCall) {
				expect(onMarkerMoved).toHaveBeenCalledExactlyOnceWith(
					routeIndex,
					expectedCall[0]
				)
			} else {
				expect(onMarkerMoved).not.toHaveBeenCalled()
			}
		})

		it('sets the cursor to grabbing while dragging over a marker', () => {
			run()
			const pointerMove = map.on.mock.calls.find(
				(call) => call[0] === 'pointermove'
			)?.[1] as (event: { originalEvent: { buttons?: number } }) => void
			map.getEventPixel.mockReturnValue([0, 0])
			map.hasFeatureAtPixel.mockReturnValue(true)

			pointerMove({ originalEvent: { buttons: 1 } })
			expect(targetElement.style.cursor).toBe('grabbing')
		})

		it('sets the cursor to grab while hovering over a marker', () => {
			run()
			const pointerMove = map.on.mock.calls.find(
				(call) => call[0] === 'pointermove'
			)?.[1] as (event: { originalEvent: { buttons?: number } }) => void
			map.getEventPixel.mockReturnValue([0, 0])
			map.hasFeatureAtPixel.mockReturnValue(true)

			pointerMove({ originalEvent: {} })
			expect(targetElement.style.cursor).toBe('grab')
		})

		it('clears the cursor while dragging without a marker hit', () => {
			run()
			const pointerMove = map.on.mock.calls.find(
				(call) => call[0] === 'pointermove'
			)?.[1] as (event: { originalEvent: { buttons?: number } }) => void
			map.hasFeatureAtPixel.mockReturnValue(false)

			pointerMove({ originalEvent: { buttons: 1 } })
			expect(targetElement.style.cursor).toBe('')
		})

		it('clears the cursor while hovering without a marker hit', () => {
			run()
			const pointerMove = map.on.mock.calls.find(
				(call) => call[0] === 'pointermove'
			)?.[1] as (event: { originalEvent: { buttons?: number } }) => void
			map.getEventPixel.mockReturnValue([0, 0])
			map.hasFeatureAtPixel.mockReturnValue(false)

			pointerMove({ originalEvent: {} })
			expect(targetElement.style.cursor).toBe('')
		})

		it('sets the cursor to grab for non-primary button movement over a marker', () => {
			run()
			const pointerMove = map.on.mock.calls.find(
				(call) => call[0] === 'pointermove'
			)?.[1] as (event: { originalEvent: { buttons?: number } }) => void
			map.getEventPixel.mockReturnValue([0, 0])
			map.hasFeatureAtPixel.mockReturnValue(true)

			pointerMove({ originalEvent: { buttons: 2 } })
			expect(targetElement.style.cursor).toBe('grab')
		})
	})
}
