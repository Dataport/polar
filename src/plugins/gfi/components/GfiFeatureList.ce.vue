<template>
	<h2 class="kern-heading-medium">
		{{ $t(($) => $.list.header, { ns: 'gfi' }) }}
	</h2>
	<template
		v-if="
			Object.values(gfiStore.listFeatures).every((list) => list.length === 0)
		"
	>
		{{ $t(($) => $.list.emptyView, { ns: 'gfi' }) }}
	</template>
	<template v-else>
		<KernPagination
			v-if="gfiStore.configuration.featureList?.pageLength"
			v-model="paginationStartIndex"
			:count="flatFeatureList.length"
			:page-size="gfiStore.configuration.featureList.pageLength"
		/>
		<section
			v-for="({ layerId, feature }, idx) of paginatedFlatFeatureList"
			:key="idx"
			tabindex="0"
			@click="
				gfiStore.featureInformation[layerId] = [serializeFeature(feature)]
			"
		>
			<h2 class="kern-title kern-title--small">
				{{ getText(feature, 'title') }}
			</h2>
			{{ getText(feature, 'subtitle') }}
			<br />
			<em>{{ getText(feature, 'subSubtitle') }}</em>
		</section>
	</template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Feature } from 'ol'
import type { FeatureList } from '../types'
import { useGfiStore } from '../store'
import { serializeFeature } from '../utils/serializeFeature'
import KernPagination from '@/components/kern/KernPagination.ce.vue'

const gfiStore = useGfiStore()

const flatFeatureList = computed(() =>
	Object.entries(gfiStore.listFeatures).flatMap(([layerId, features]) =>
		features.map((feature) => ({
			layerId,
			feature,
		}))
	)
)

const paginationStartIndex = ref(0)
const paginatedFlatFeatureList = computed(() =>
	flatFeatureList.value.slice(
		paginationStartIndex.value,
		gfiStore.configuration.featureList?.pageLength
			? paginationStartIndex.value +
					gfiStore.configuration.featureList.pageLength
			: undefined
	)
)

function getText(
	feature: Feature,
	type: keyof NonNullable<FeatureList['text']>
) {
	const text = gfiStore.configuration.featureList?.text?.[type]
	if (typeof text === 'string') {
		return text
	}
	if (typeof text === 'function') {
		return text(feature)
	}
	return null
}
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

	&:hover {
		border-radius: var(--kern-metric-border-radius-default);
		border-color: var(--kern-color-action-default);
		cursor: pointer;
	}
}
</style>
