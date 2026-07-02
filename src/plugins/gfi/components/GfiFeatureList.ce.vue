<template>
	<h2 class="kern-heading-medium">
		{{ $t(($) => $.list.header, { ns: 'gfi' }) }}
	</h2>
	<template v-if="gfiStore.listFlatFeatures.length === 0">
		{{ $t(($) => $.list.emptyView, { ns: 'gfi' }) }}
	</template>
	<template v-else>
		<KernPagination
			v-if="gfiStore.listPaginationActive"
			v-model="gfiStore.listPaginationStartIndex"
			:count="gfiStore.listFlatFeatures.length"
			:page-size="gfiStore.listPageLength"
		/>
		<section
			v-for="(
				{ layerId, feature, hovered }, idx
			) of gfiStore.listPaginatedFeatures"
			:key="idx"
			tabindex="0"
			:class="{
				hovered,
			}"
			@click="
				(() => {
					gfiStore.selectedFeatures = { [layerId]: [feature] }
					gfiStore.hoveredFeatures = {}
				})()
			"
			@mouseenter="gfiStore.hoveredFeatures = { [layerId]: [feature] }"
			@mouseleave="gfiStore.hoveredFeatures = {}"
		>
			<h2 class="kern-title kern-title--small">
				{{ gfiStore.listGetText(feature, 'title') }}
			</h2>
			{{ gfiStore.listGetText(feature, 'subtitle') }}
			<br />
			<em>{{ gfiStore.listGetText(feature, 'subSubtitle') }}</em>
		</section>
	</template>
</template>

<script setup lang="ts">
import KernPagination from '@/components/kern/KernPagination.ce.vue'

import { useGfiStore } from '../store'

const gfiStore = useGfiStore()
</script>

<style scoped>
section {
	width: 100%;
	padding: var(--kern-metric-space-small);
	overflow: hidden;
	text-overflow: ellipsis;
	border-width: var(--kern-metric-border-width-default);
	border-style: dashed;
	border-color: transparent;

	&.hovered,
	&:hover {
		border-radius: var(--kern-metric-border-radius-default);
		border-color: var(--kern-color-action-default);
		cursor: pointer;
	}
}
</style>
