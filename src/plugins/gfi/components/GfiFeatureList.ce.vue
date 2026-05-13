<template>
	<header class="kern-card__header">
		<hgroup>
			<h2 class="kern-heading-medium">
				{{ $t(($) => $.list.header, { ns: PluginId }) }}
			</h2>
		</hgroup>
	</header>
	<section class="kern-card__body">
		<p
			v-if="gfiStore.listFlatFeatures.length === 0"
			class="kern-body kern-body--small polar-plugin-gfi-list-empty-view"
		>
			{{ $t(($) => $.list.emptyView, { ns: PluginId }) }}
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
					'feature-list-item': true,
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
	</section>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

import KernPagination from '@/components/kern/KernPagination.ce.vue'

import { useGfiStore } from '../store'
import { PluginId } from '../types'

const gfiStore = useGfiStore()
</script>

<style scoped>
.polar-plugin-gfi-list-empty-view {
	text-wrap: wrap;
}

section.feature-list-item {
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
