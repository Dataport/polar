import type VectorLayer from 'ol/layer/Vector'

import { Collection, Feature, Map, MapBrowserEvent } from 'ol'

/* sets the topmost hovered feature as singleton feature in collection */
export const makeLocalSelector =
	(
		map: Map,
		activeContainer: { active: boolean },
		features: Collection<Feature>,
		drawLayer: VectorLayer
	) =>
	// bound event processor
	(e: MapBrowserEvent) => {
		if (!activeContainer.active) {
			map.forEachFeatureAtPixel(
				e.pixel,
				(f) => {
					if (f !== features.item(0)) {
						features.setAt(0, f as Feature)
					}
					return true
				},
				{
					layerFilter: (l) => l === drawLayer,
				}
			)
		}
	}
