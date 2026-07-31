/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/gfi/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'

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
		 * Hovered features.
		 * This is only used for the list view.
		 *
		 * @alpha
		 */
		hoveredFeatures: gfiListStoreRefs.hoveredFeatures,

		/**
		 * Selected features.
		 * This is only used if the feature is loaded from the list view.
		 *
		 * @alpha
		 */
		selectedFeatures: gfiMainStoreRefs.selectedFeatures,

		/**
		 * Feature information for the currently selected feature(s).
		 *
		 * @alpha
		 */
		featureInformation: gfiMainStoreRefs.featureInformation,

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
		 * If pagination is configured, the number of features per page.
		 * Otherwise, the behaviour is undefined.
		 *
		 * @alpha
		 */
		listPageLength: gfiListStoreRefs.pageLength,

		/**
		 * If pagination is configured, the page that is currently selected in the list view.
		 * Otherwise, the behaviour is undefined.
		 *
		 * @alpha
		 */
		listPage: gfiListStoreRefs.page,

		/**
		 * If pagination is configured, the index of the first feature that is shown on the current page.
		 * Otherwise, the value is zero.
		 *
		 * The index refers to `listFlatFeatures`.
		 *
		 * @alpha
		 */
		listPaginationStartIndex: gfiListStoreRefs.paginationStartIndex,

		/**
		 * If pagination is configured, the index of the last feature that is shown on the current page.
		 * Otherwise, the value is `undefined`.
		 *
		 * The index refers to `listFlatFeatures`.
		 *
		 * To mutate this value, change `listPage` or `listPaginationStartIndex`.
		 *
		 * @readonly
		 * @alpha
		 */
		listPaginationEndIndex: gfiListStoreRefs.paginationEndIndex,

		/**
		 * Paginated list of features to display in the list view.
		 * If pagination is not configured, this equals `listFlatFeatures`.
		 *
		 * @alpha
		 */
		listPaginatedFeatures: gfiListStoreRefs.paginatedFeatures,

		/**
		 * Get the text description of a feature for the list view.
		 *
		 * @param feature - The feature to get the text description for
		 * @param type - Type of text to retrieve (e.g., `'title'`)
		 * @alpha
		 */
		listGetText: gfiListStore.getText,

		/**
		 * Features that should be displayed in a detail view.
		 *
		 * @alpha
		 */
		features: gfiFeatureStoreRefs.visibleFeatures,

		/**
		 * Index of the selected feature for the detail view.
		 * This is used to calculate `feature`.
		 *
		 * @alpha
		 */
		featureIndex: gfiFeatureStoreRefs.selectedFeatureIndex,

		/**
		 * Selected feature for the detail view.
		 * This is the currently shown feature.
		 *
		 * To mutate this value, change `featureIndex`.
		 *
		 * @readonly
		 * @alpha
		 */
		feature: gfiFeatureStoreRefs.selectedFeature,

		/**
		 * Properties for the selected feature in detail view.
		 * The properties are already filtered by configuration.
		 *
		 * @readonly
		 * @alpha
		 */
		properties: gfiFeatureStoreRefs.selectedFeatureProperties,

		/**
		 * If an export property is configured and defined, the value of that property.
		 * Otherwise `null`.
		 *
		 * @readonly
		 * @alpha
		 */
		exportProperty: gfiFeatureStoreRefs.exportProperty,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useGfiStore, import.meta.hot))
}
