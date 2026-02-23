import type { Feature as GeoJsonFeature } from 'geojson'
import type { Style } from 'ol/style'

import { Feature, Map } from 'ol'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import { Vector } from 'ol/source'
import { onScopeDispose, watch, type Ref } from 'vue'

function getFeatureDisplayLayer() {
	const featureDisplayLayer = new VectorLayer({
		source: new Vector<Feature>({
			features: [],
		}),
	})

	featureDisplayLayer.set('polarInternalId', 'pluginGfiFeatureDisplay')
	featureDisplayLayer.setZIndex(90)
	// NOTE: This may be changed in the future to not use the default styling of @masterportal/masterportalapi
	featureDisplayLayer.set('styleId', 'defaultHighlightFeaturesPoint')

	return featureDisplayLayer
}

function isVectorSource(source): source is Vector {
	return source instanceof Vector
}

/**
 * reset feature layer's features.
 */
function clear(featureDisplayLayer: VectorLayer): void {
	const source = featureDisplayLayer.getSource()
	if (isVectorSource(source)) {
		source.clear()
	}
}

/**
 * add feature from jsonable GeoJson object.
 */
function addFeature(
	feature: GeoJsonFeature,
	featureDisplayLayer: VectorLayer
): void {
	const source = featureDisplayLayer.getSource()
	if (isVectorSource(source)) {
		// Since ol@10, readFeature may also return a Feature[]?
		source.addFeature(new GeoJSON().readFeature(feature) as Feature)
	}
}

export function useFeatureDisplayLayer(options: {
	map: Map
	style: Ref<Style>
	features: Ref<GeoJsonFeature[]>
}) {
	const { map, style, features } = options
	const layer = getFeatureDisplayLayer()

	map.addLayer(layer)
	onScopeDispose(() => {
		map.removeLayer(layer)
	})

	watch(
		style,
		(newStyle) => {
			layer.setStyle(newStyle)
		},
		{ immediate: true }
	)

	watch(
		features,
		(newFeatures) => {
			clear(layer)
			newFeatures.forEach((feature) => {
				addFeature(feature, layer)
			})
		},
		{ immediate: true, deep: true }
	)

	return {}
}
