import type { Feature as GeoJsonFeature } from 'geojson'

import Feature from 'ol/Feature'
import { GeoJSON } from 'ol/format'

export function filterSelectableFeatures(
	features: Feature[],
	isSelectable?: (feature: GeoJsonFeature) => boolean
) {
	if (!isSelectable) {
		return features
	}

	const geoJson = new GeoJSON()
	return features.filter((feature) =>
		isSelectable(geoJson.writeFeatureObject(feature))
	)
}

if (import.meta.vitest) {
	const { expect, test, vi } = import.meta.vitest

	test('filters unselectable features from a cluster', () => {
		const selectableFeature = new Feature({ selectable: true })
		const unselectableFeature = new Feature({ selectable: false })
		const isSelectable = vi.fn(
			(feature) => feature.properties?.selectable === true
		)

		expect(
			filterSelectableFeatures(
				[selectableFeature, unselectableFeature],
				isSelectable
			)
		).toEqual([selectableFeature])
		expect(isSelectable).toHaveBeenCalledTimes(2)
	})

	test('keeps all features without an isSelectable callback', () => {
		const features = [new Feature(), new Feature()]

		expect(filterSelectableFeatures(features)).toBe(features)
	})
}
