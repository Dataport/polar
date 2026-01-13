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
			<v-divider
				v-if="Boolean(category)"
				:key="['results-divider', index].join('-')"
			></v-divider>
		</v-list>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
	name: 'AddressSearchResults',
	computed: {
		...mapGetters('plugin/addressSearch', [
			'featuresAvailable',
			'featureListsWithCategory',
			'focusAfterSearch',
		]),
	},
	watch: {
		featuresAvailable(): void {
			if (this.focusAfterSearch) {
				this.$nextTick(() =>
					focusFirstResult(this.featureListsWithCategory.length)
				)
			}
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
</style>
