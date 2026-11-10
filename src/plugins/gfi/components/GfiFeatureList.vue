<template>
	<header class="kern-card__header">
		<hgroup>
			<h2 class="kern-title">
				<span
					v-if="gfiStore.configuration.featureList?.icon"
					class="kern-icon"
					:class="gfiStore.configuration.featureList?.icon"
				/>
				{{ $t(($) => $.list.header, { ns: PluginId }) }}
			</h2>
			<KernPagination
				v-if="gfiStore.listPaginationActive && gfiStore.listFlatFeatures.length"
				v-model="gfiStore.listPaginationStartIndex"
				:count="gfiStore.listFlatFeatures.length"
				:page-size="gfiStore.listPageLength"
			/>
		</hgroup>
	</header>
	<section class="kern-card__body" @mouseleave="gfiStore.hoveredFeature = null">
		<p
			v-if="gfiStore.listFlatFeatures.length === 0"
			class="kern-body kern-body--small polar-plugin-gfi-list-empty-view"
		>
			{{ $t(($) => $.list.emptyView, { ns: PluginId }) }}
		</p>
		<!-- role="list" keeps the list semantics despite `list-style: none`. -->
		<ul v-else class="feature-list" role="list">
			<li
				v-for="(
					{ layerId, feature, hovered, text }, index
				) of gfiStore.listEnrichedPaginatedFeatures"
				:key="index"
			>
				<div
					tabindex="0"
					role="button"
					class="feature-list-item"
					:class="{ hovered }"
					@click="setSelectedFeature(layerId, feature)"
					@keydown.enter.prevent="setSelectedFeature(layerId, feature)"
					@keydown.space.prevent="setSelectedFeature(layerId, feature)"
					@mouseenter="gfiStore.hoveredFeature = { layerId, feature }"
					@focus="gfiStore.hoveredFeature = { layerId, feature }"
					@blur="gfiStore.hoveredFeature = null"
				>
					<h3 class="kern-title kern-title--small">
						{{ text.title }}
					</h3>
					<p class="kern-subline kern-subline--small">
						{{ text.subtitle }}
					</p>
					<p class="kern-body kern-body--small" :title="text.subSubtitle || ''">
						{{ text.subSubtitle }}
					</p>
				</div>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import type { Feature } from 'ol'

import { nextTick } from 'vue'

import KernPagination from '@/components/kern/KernPagination.vue'

import { useGfiStore } from '../store'
import { PluginId } from '../types'

const gfiStore = useGfiStore()

async function setSelectedFeature(layerId: string, feature: Feature) {
	gfiStore.hoveredFeature = null
	await nextTick()
	gfiStore.selectedFeature = { layerId, feature }
}
</script>

<style scoped>
header {
	padding: 0 var(--kern-metric-space-small);

	h2 {
		display: flex;
		align-items: center;
		gap: var(--kern-metric-space-small);
	}
}

.kern-card__body {
	gap: 0;
	/*
 	 * Prevents the feature texts from contributing to the card's width.
 	 */
	contain: inline-size;

	.polar-plugin-gfi-list-empty-view {
		padding: var(--kern-metric-space-small);
		text-wrap: wrap;
	}

	.feature-list {
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;

		.feature-list-item {
			width: 100%;
			padding: var(--kern-metric-space-small);
			overflow: hidden;
			text-overflow: ellipsis;
			border-width: var(--kern-metric-border-width-default);
			border-style: dashed;
			border-color: transparent;

			&.hovered,
			&:hover {
				background-color: oklch(0.9373 0.031 142.34);
			}

			&:hover,
			&:focus {
				border-radius: var(--kern-metric-border-radius-default);
				border-color: oklch(0.639 0.177 141.85);
			}

			&:hover {
				cursor: pointer;
			}

			&:focus {
				border-style: solid;
			}

			& > .kern-subline,
			& > .kern-body {
				padding: 0;
			}

			& > .kern-body--small {
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				/*
				 * Not fully supported yet, thus the above -webkit stuff as well.
				 * See https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-clamp
				 * for when this may become baseline.
				 */
				line-clamp: 2;
				text-wrap: wrap;
			}
		}
	}
}
</style>
