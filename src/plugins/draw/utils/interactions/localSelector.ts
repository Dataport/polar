import type { Collection, Feature, Map, MapBrowserEvent } from 'ol'
import type VectorLayer from 'ol/layer/Vector'

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
		if (activeContainer.active) {
			return
		}
		const hoveredFeature = map.forEachFeatureAtPixel(
			e.pixel,
			(f) => f as Feature,
			{
				layerFilter: (l) => l === drawLayer,
			}
		)
		if (!hoveredFeature) {
			// required to update on text deletion
			features.clear()
		} else if (hoveredFeature !== features.item(0)) {
			features.setAt(0, hoveredFeature)
		}
	}
