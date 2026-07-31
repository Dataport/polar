<template>
	<PolarCard
		v-if="gfiStore.features.length > 0 || gfiStore.configuration.featureList"
		id="polar-card-gfi"
		:class="{
			standard: coreStore.layout === 'standard',
			'nine-regions': coreStore.layout === 'nineRegions',
		}"
	>
		<template v-if="gfiStore.features.length > 0">
			<GfiFeature v-if="gfiStore.feature" v-bind="gfiStore.feature" />
			<button
				v-if="gfiStore.featureIndex > 0"
				class="kern-btn kern-btn--block kern-btn--secondary"
				@click="gfiStore.featureIndex--"
			>
				<span class="kern-icon kern-icon--arrow-back" aria-hidden="true" />
				<span class="kern-label">
					{{ $t(($) => $.switch.previous, { ns: 'gfi' }) }}
				</span>
			</button>
			<button
				v-if="gfiStore.featureIndex + 1 < gfiStore.features.length"
				class="kern-btn kern-btn--block kern-btn--primary"
				@click="gfiStore.featureIndex++"
			>
				<span class="kern-label">
					{{ $t(($) => $.switch.next, { ns: 'gfi' }) }}
				</span>
				<span class="kern-icon kern-icon--arrow-forward" aria-hidden="true" />
			</button>
		</template>
		<template v-else-if="gfiStore.configuration.featureList">
			<GfiFeatureList />
		</template>
	</PolarCard>
</template>

<script setup lang="ts">
import PolarCard from '@/components/PolarCard.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useGfiStore } from '../store'
import GfiFeature from './GfiFeature.ce.vue'
import GfiFeatureList from './GfiFeatureList.ce.vue'

const coreStore = useCoreStore()
const gfiStore = useGfiStore()
</script>

<style scoped>
#polar-card-gfi {
	width: 12em;
	margin: var(--kern-metric-space-small);
	max-height: 80%;
	overflow: auto;

	&.standard {
		position: absolute;
	}

	&::deep(.kern-card__container) {
		width: 100%;
		padding-bottom: var(--kern-metric-space-small);
	}
}

button {
	margin-top: var(--kern-metric-space-small);
}
</style>
