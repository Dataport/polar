<template>
	<v-card
		v-if="featuresAvailable"
		tile
		dense
		class="mx-auto overflow-y-auto rounded-b-xl polar-plugin-address-search-toolbar-results"
		:max-height="maxHeight"
		:ripple="false"
		tabindex="-1"
	>
		<v-list>
			<template v-for="(feature, innerDex) in features">
				<v-list-item
					:class="{
						'polar-plugin-address-search-hidden-result':
							innerDex >=
							(areResultsExpanded(category)
								? Number.MAX_SAFE_INTEGER
								: limitResults),
					}"
				>
					<component
						:is="afterResultComponent"
						v-if="afterResultComponent"
						:feature="feature"
						:focus="focusIndex === `${index}-${innerDex}`"
					></component>
				</v-list-item>
			</template>
			<v-btn
				v-if="features.length > limitResults"
				:id="`polar-plugin-address-search-results-feature-expand-button-${index}`"
				text
				tile
				block
				class="text-none"
				@keydown.down.prevent.stop="(event) => focusNextElement(true, event)"
				@keydown.up.prevent.stop="(event) => focusNextElement(false, event)"
				@click="toggle(category)"
			>
				<v-icon x-small class="mr-1">
					{{
						areResultsExpanded(category) ? 'fa-chevron-up' : 'fa-chevron-down'
					}}
				</v-icon>
				{{
					$t(
						`plugins.addressSearch.resultList.${
							areResultsExpanded(category)
								? 'reduce'
								: `extend${hasMaximum(selectedGroup[index]) ? 'Max' : ''}`
						}`,
						selectedGroup[index]
					)
				}}
			</v-btn>
			<v-divider
				v-if="Boolean(category)"
				:key="['results-divider', index].join('-')"
			></v-divider>
		</v-list>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { focusFirstResult } from '../utils/focusFirstResult'
import { emTitleByInput } from '../utils/emTitleByInput'

export default Vue.extend({
	name: 'AddressSearchResults',
	data: () => ({
		focusIndex: '',
	}),
	computed: {
		...mapGetters(['clientHeight', 'hasWindowSize']),
		...mapGetters('plugin/addressSearch', [
			'afterResultComponent',
			'featuresAvailable',
			'featureListsWithCategory',
			'focusAfterSearch',
			'inputValue',
			'limitResults',
			'selectedGroupId',
			'selectedGroup',
		]),
		maxHeight(): number {
			return this.hasWindowSize ? this.clientHeight * 0.6 : 400
		},
	},
	watch: {
		featuresAvailable(): void {
			if (this.focusAfterSearch) {
				this.$nextTick(() =>
					focusFirstResult(this.featureListsWithCategory.length)
				)
			}
		},
		/* reset opened categories on group change */
		selectedGroupId(): void {
			this.openCategories = []
		},
	},
	methods: {
		...mapActions('plugin/addressSearch', ['selectResult', 'escapeSelection']),
		toggle(category: string): void {
			this.openCategories =
				this.openCategories.indexOf(category) === -1
					? [...this.openCategories, category]
					: this.openCategories.filter((s) => s !== category)
		},
		hasMaximum(searchService) {
			return Boolean(searchService?.queryParameters?.maxFeatures)
		},
		emTitleByInput,
		isExpandButtonVisible(featureListLength: number): boolean {
			return featureListLength > this.limitResults
		},
		areResultsExpanded(category: string): boolean {
			return this.openCategories.includes(category)
		},
	},
})
</script>

<style lang="scss">
.polar-plugin-address-search-toolbar-results {
	em {
		font-style: unset;
		font-weight: bold;
	}

	.v-list {
		padding-bottom: 0;
	}
}

/* hidden results are still 'rendered' to take horizontal space:
 * that prevents width hopping on result expansion */
.polar-plugin-address-search-hidden-result {
	visibility: hidden;
	overflow: hidden;
	max-height: 0;
	height: 0;
	min-height: 0;
}
</style>
