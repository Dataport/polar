<template>
	<h2 class="kern-heading-medium">
		{{ $t(($) => $.list.header, { ns: 'gfi' }) }}
	</h2>
	<p
		v-if="gfiStore.listFlatFeatures.length === 0"
		class="kern-body kern-body--small polar-plugin-gfi-list-empty-view"
	>
		{{ $t(($) => $.list.emptyView, { ns: 'gfi' }) }}
	</p>
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
				(async () => {
					gfiStore.hoveredFeatures = {}
					await nextTick()
					gfiStore.selectedFeatures = { [layerId]: [feature] }
				})()
			"
			@mouseenter="gfiStore.hoveredFeatures = { [layerId]: [feature] }"
			@mouseleave="gfiStore.hoveredFeatures = {}"
		>
			<h3 class="kern-title kern-title--small">
				{{ gfiStore.listGetText(feature, 'title') }}
			</h3>
			{{ gfiStore.listGetText(feature, 'subtitle') }}
			<br />
			<em>{{ gfiStore.listGetText(feature, 'subSubtitle') }}</em>
		</section>
	</template>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

import KernPagination from '@/components/kern/KernPagination.ce.vue'

import { useGfiStore } from '../store'

const gfiStore = useGfiStore()
</script>

<style scoped>
.polar-plugin-gfi-list-empty-view {
	text-wrap: wrap;
}

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
