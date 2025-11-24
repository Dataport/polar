<template>
	<!-- TODO: migrate search functionality one after another -->
	<!-- TODO: All search functions should be moved to the lib package so they may be used in Routing as well  -->
	<!--
		Additionally set here as featuresAvailable would not ensure type safety.
		featuresAvailable also already ensures that searchResults has at least one element.
	-->
	<div
		v-if="Array.isArray(searchResults)"
		class="polar-plugin-address-search-result-wrapper"
	>
		<template v-for="result in searchResults" :key="result.categoryId">
			<!-- TODO: Style this like v-subheader before -->
			<span v-if="searchResults.length > 1">
				{{ result.categoryLabel }}
				{{
					$t(($) => $.resultCount, {
						count: result.features.features.length,
						ns: PluginId,
					})
				}}
			</span>
			<!-- TODO: Use a separate component for <ul> to be able to more easily use it in StandardResults -->
			<ul>
				<template
					v-for="(feature, index) in result.features.features"
					:key="index"
				>
					<!-- TODO: Add things to be done on keydown etc. -->
					<li>
						<!-- TODO: Improve the type so relevant stuff is there -->
						<!-- TODO: Add styling like v-list-item-title -->
						<!-- eslint-disable vue/no-v-html -->
						<!-- TODO: Talk with design regarding button style -->
						<button
							class="kern-btn kern-btn--tertiary"
							v-html="strongTitleByInput(feature.title, inputValue)"
						/>
						<!-- eslint-enable vue/no-v-html -->
						<!-- TODO: Add afterResultComponent, if configured -->
					</li>
					<!-- TODO: Implement button that expands the results -->
					<!-- TODO: Add divider -->
				</template>
			</ul>
		</template>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAddressSearchStore } from '../store'
import { PluginId } from '../types'
import { strongTitleByInput } from '../utils/strongTitleByInput'

const { inputValue, searchResults } = storeToRefs(useAddressSearchStore())

const openCategories = ref<string[]>([])
</script>

<style scoped>
.polar-plugin-address-search-result-wrapper {
	width: 100%;

	ul {
		margin-top: var(--kern-metric-space-small);
		padding: 0;

		li {
			display: flex;
			margin: 0 var(--kern-metric-space-default);
		}
	}
}
</style>
