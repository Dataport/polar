/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/gfi/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { readonly } from 'vue'

import { useGfiFeatureStore } from './stores/feature'
import { useGfiListStore } from './stores/list'
import { useGfiMainStore } from './stores/main'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for feature information requests.
 */
/* eslint-enable tsdoc/syntax */
export const useGfiStore = defineStore('plugins/gfi', () => {
	const gfiMainStore = useGfiMainStore()
	const gfiMainStoreRefs = storeToRefs(gfiMainStore)

	const gfiListStore = useGfiListStore()
	const gfiListStoreRefs = storeToRefs(gfiListStore)

	const gfiFeatureStore = useGfiFeatureStore()
	const gfiFeatureStoreRefs = storeToRefs(gfiFeatureStore)

	return {
		/**
		 * Plugin configuration.
		 *
		 * @alpha
		 */
		configuration: gfiMainStoreRefs.configuration,

		/**
		 * Render type for the plugin.
		 *
		 * @alpha
		 */
		renderType: gfiMainStoreRefs.renderType,

		/**
		 * Whether there are any layers with a configured window that are currently visible on the map.
		 *
		 * @alpha
		 */
		hasActiveWindowLayers: gfiMainStoreRefs.hasActiveWindowLayers,

		/**
		 * Hovered feature.
		 * This is a feature whose hovering state is originated at the plugin.
		 *
		 * This is only used for the list view.
		 *
		 * @alpha
		 */
		hoveredFeature: gfiListStoreRefs.hoveredFeature,

		/**
		 * Hovered features.
		 * The hovering state may be originated either from {@link hoveredFeature} or by other means.
		 *
		 * This is only used for the list view.
		 *
		 * @readonly
		 * @alpha
		 */
		hoveredFeatures: readonly(gfiListStoreRefs.hoveredFeatures),

		/**
		 * Selected feature.
		 * This is only used if the feature is loaded from the list view.
		 *
		 * @alpha
		 */
		selectedFeature: gfiMainStoreRefs.olFeature,

		/**
		 * Selected features.
		 * This is only used if the feature is loaded from the list view.
		 *
		 * @readonly
		 * @alpha
		 */
		selectedFeatures: readonly(gfiMainStoreRefs.olFeatures),

		/**
		 * Feature information for the currently selected feature(s).
		 *
		 * @alpha
		 */
		featureInformation: gfiMainStoreRefs.geoJsonFeatures,

		/**
		 * List of features that should be displayed in a list view.
		 *
		 * @alpha
		 */
		listFeatures: gfiListStoreRefs.features,

		/**
		 * Flattened list of features for the list view.
		 *
		 * @alpha
		 */
		listFlatFeatures: gfiListStoreRefs.flatFeatures,

		/**
		 * `true` if pagination is configured for the list view.
		 *
		 * @alpha
		 */
		listPaginationActive: gfiListStoreRefs.paginationActive,

		/**
		 * If {@link FeatureList.pageLength | pagination} is configured, the number of features per page.
		 *
		 * @alpha
		 */
		listPageLength: gfiListStoreRefs.pageLength,

		/**
		 * If {@link FeatureList.pageLength | pagination} is configured, the page that is currently selected in the list view.
		 *
		 * @alpha
		 */
		listPage: gfiListStoreRefs.page,

		/**
		 * If {@link FeatureList.pageLength | pagination} is configured, the index of the first feature (inclusive) that is shown on the current page.
		 * Otherwise, the value is zero.
		 *
		 * The index refers to {@link listFlatFeatures}.
		 *
		 * @alpha
		 */
		listPaginationStartIndex: gfiListStoreRefs.paginationStartIndex,

		/**
		 * If {@link FeatureList.pageLength | pagination} is configured, the index of the last feature (exclusive) that is shown on the current page.
		 * Otherwise, the value is `undefined`.
		 *
		 * The index refers to {@link listFlatFeatures}.
		 *
		 * To mutate this value, change {@link listPage} or {@link listPaginationStartIndex}.
		 *
		 * @readonly
		 * @alpha
		 */
		listPaginationEndIndex: gfiListStoreRefs.paginationEndIndex,

		/**
		 * Paginated list of features to display in the list view.
		 * If {@link FeatureList.pageLength | pagination} is not configured, this equals {@link listFlatFeatures}.
		 *
		 * @alpha
		 */
		listPaginatedFeatures: gfiListStoreRefs.paginatedFeatures,

		/**
		 * Enriched paginated list of features to display in the list view.
		 * This includes additional text information for each feature.
		 *
		 * @alpha
		 */
		listEnrichedPaginatedFeatures: gfiListStoreRefs.enrichedPaginatedFeatures,

		/**
		 * Get the text description of a feature for the list view.
		 *
		 * @param feature - The feature to get the text description for
		 * @param type - Type of text to retrieve (e.g., `'title'`)
		 * @alpha
		 */
		listGetText: gfiListStore.getText,

		/**
		 * Features that should be displayed in the detailed view.
		 *
		 * @alpha
		 */
		features: gfiFeatureStoreRefs.visibleFeatures,

		/**
		 * Index of the selected feature for the detailed view.
		 * This is used to calculate {@link feature}.
		 *
		 * @alpha
		 */
		featureIndex: gfiFeatureStoreRefs.selectedFeatureIndex,

		/**
		 * Selected feature for the detailed view.
		 * This is the currently shown feature.
		 *
<<<<<<< HEAD
=======
		 * To mutate this value, change {@link featureIndex}.
		 *
		 * @readonly
>>>>>>> vue3/migrate-plugin-gfi
		 * @alpha
		 */
		feature: gfiMainStoreRefs.geoJsonFeature,

		/**
		 * Properties for the selected feature in the detailed view.
		 * The properties are already filtered by configuration.
		 *
		 * @readonly
		 * @alpha
		 */
		properties: gfiFeatureStoreRefs.selectedFeatureProperties,

		/**
		 * If an {@link GfiLayerConfiguration.exportProperty} is configured and defined, the value of that property.
		 *
		 * @defaultValue `null`
		 *
		 * @readonly
		 * @alpha
		 */
		exportProperty: gfiFeatureStoreRefs.exportProperty,

		/**
		 * The title for the selected feature in the detailed view.
		 *
		 * @readonly
		 * @alpha
		 */
		title: gfiFeatureStoreRefs.title,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiStore, import.meta.hot))
}
