<template>
	<PolarCard
		v-if="gfiStore.features.length > 0 || gfiStore.configuration.featureList"
		id="polar-card-gfi"
		:class="{
			standard: coreStore.layout === 'standard',
			independent: gfiStore.renderType === 'independent',
		}"
	>
		<GfiFeature v-if="gfiStore.feature" v-bind="gfiStore.feature" />
		<GfiFeatureList v-else-if="gfiStore.configuration.featureList" />
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
	&.standard {
		position: absolute;
	}

	&.independent {
		width: calc(
			var(--kern-metric-dimension-5x-large) +
				var(--kern-metric-dimension-5x-large)
		);
		max-height: 80%;
		overflow: auto;
	}
}

button {
	margin-top: var(--kern-metric-space-small);
}
</style>
