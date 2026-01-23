<template>
	<PolarCard id="polar-card-gfi">
		<template v-if="visibleFeatures.length > 0">
			<GfiFeature v-if="selectedFeature" v-bind="selectedFeature" />
			<button
				v-if="selectedFeatureIndex > 0"
				class="kern-btn kern-btn--block kern-btn--secondary"
				@click="selectedFeatureIndex--"
			>
				<span class="kern-icon kern-icon--arrow-back" aria-hidden="true" />
				<span class="kern-label">
					{{ $t(($) => $.switch.previous, { ns: 'gfi' }) }}
				</span>
			</button>
			<button
				v-if="selectedFeatureIndex + 1 < visibleFeatures.length"
				class="kern-btn kern-btn--block kern-btn--primary"
				@click="selectedFeatureIndex++"
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
import { computed, ref, watch } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'

import { useGfiStore } from '../store'
import GfiFeature from './GfiFeature.ce.vue'
import GfiFeatureList from './GfiFeatureList.ce.vue'

const gfiStore = useGfiStore()

const visibleFeatures = computed(() =>
	Object.entries(gfiStore.featureInformation)
		.filter(([layerId]) => gfiStore.configuration.layers[layerId]?.window)
		.flatMap(([layerId, features]) =>
			features.map((feature) => ({ layerId, feature }))
		)
)

const selectedFeatureIndex = ref(0)
const selectedFeature = computed(
	() => visibleFeatures.value[selectedFeatureIndex.value]
)

watch(visibleFeatures, () => {
	selectedFeatureIndex.value = 0
})
</script>

<style scoped>
#polar-card-gfi {
	width: 12em;
	pointer-events: all;
	padding-bottom: 3em;
}
</style>
