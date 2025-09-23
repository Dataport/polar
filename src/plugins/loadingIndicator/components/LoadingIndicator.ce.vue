<template>
	<PolarCard v-if="showLoader">
		<header class="kern-card__header">
			<h2 class="kern-title">
				{{ $t('loading', { ns: PluginId }) }}
			</h2>
		</header>
		<section class="kern-card__body">
			<!-- TODO(dopenguin): place the loader in the center of the map -->
			<div
				v-if="loaderStyle === 'kern-loader'"
				class="kern-loader kern-loader--visible"
				role="status"
			/>
			<!-- TODO(dopenguin): Properly map the components here -->
			<component
				:is="loaderStyle"
				v-else
				class="kern-loader--visible"
				role="status"
			/>
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PluginId } from '../types'
import { useLoadingIndicatorStore } from '../store'
import PolarCard from '@/components/PolarCard.ce.vue'
const { loaderStyle, showLoader } = storeToRefs(useLoadingIndicatorStore())
// TODO(dopenguin): Adjust size (both of the container and the loader itself)
</script>

<style scoped>
.kern-card__header {
	align-items: center;
}
</style>
