<template>
	<header class="kern-card__header">
		<hgroup>
			<h2 class="kern-heading-medium">
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
	<section class="kern-card__body" @mouseleave="gfiStore.hover(null)">
		<p
			v-if="gfiStore.listFlatFeatures.length === 0"
			class="kern-body kern-body--small polar-plugin-gfi-list-empty-view"
		>
			{{ $t(($) => $.list.emptyView, { ns: PluginId }) }}
		</p>
		<template v-else>
			<section
				v-for="(
					{ layerId, feature, hovered, text }, index
				) of gfiStore.listEnrichedPaginatedFeatures"
				:key="index"
				tabindex="0"
				class="feature-list-item"
				:class="{ hovered }"
				@click="setSelectedFeature(layerId, feature)"
				@mouseenter="gfiStore.hover({ layerId, feature })"
				@focus="gfiStore.hover({ layerId, feature })"
				@blur="gfiStore.hover(null)"
			>
				<h3 class="kern-title kern-title--small">
					{{ text.title }}
				</h3>
				<p class="kern-subline kern-subline--small">
					{{ text.subtitle }}
				</p>
				<p class="kern-body kern-body--small">
					{{ text.subSubtitle }}
				</p>
			</section>
		</template>
	</section>
</template>

<script setup lang="ts">
import type { Feature } from 'ol'

import { markRaw, nextTick } from 'vue'

import KernPagination from '@/components/kern/KernPagination.ce.vue'

import { useGfiStore } from '../store'
import { PluginId } from '../types'

const gfiStore = useGfiStore()

async function setSelectedFeature(layerId: string, feature: Feature) {
	gfiStore.hoveredFeatures = markRaw({})
	await nextTick()
	gfiStore.selectedFeatures = markRaw({
		[layerId]: markRaw([feature]),
	})
}
</script>

<style scoped>
header.kern-card__header {
	padding: 0 var(--kern-metric-space-small);
}

hgroup {
	width: 100%;
}

h2.kern-heading-medium {
	display: flex;
	align-items: center;
	gap: var(--kern-metric-space-small);
}

.polar-plugin-gfi-list-empty-view {
	padding: var(--kern-metric-space-small);
	text-wrap: wrap;
}

section.kern-card__body {
	gap: 0;
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
}
</style>
