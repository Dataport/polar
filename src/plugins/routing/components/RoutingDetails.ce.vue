<template>
	<div class="routing-details-wrapper">
		<div class="routing-details-header">
			<span>
				{{ $t(($) => $.duration, { ns: PluginId }) }}
				{{ formatDuration(duration) }} &nbsp;
			</span>
			<span>
				{{ $t(($) => $.distance, { ns: PluginId }) }}
				{{ formatDistance(distance) }}
			</span>
		</div>
		<dl class="kern-description-list kern-description-list--col">
			<div
				v-for="(step, i) in steps"
				:key="i"
				class="kern-description-list-item"
			>
				<dt class="kern-description-list-item__key">{{ step.instruction }}</dt>
				<dd class="kern-description-list-item__value">
					{{ $t(($) => $.duration, { ns: PluginId }) }}
					{{ formatDuration(step.duration) }},
					{{ $t(($) => $.distance, { ns: PluginId }) }}
					{{ formatDistance(step.distance) }}
				</dd>
			</div>
		</dl>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useRoutingStore } from '../store.ts'
import { PluginId, type RouteSegment } from '../types'

const routingStore = useRoutingStore()

const segments = computed<RouteSegment[]>(() => {
	// TODO(dopenguin): Check whether there is always only one feature
	const feature = routingStore.routingResponseData?.features[0]
	if (!feature || !feature.properties) {
		return []
	}
	return feature.properties.segments
})
const distance = computed(() =>
	segments.value.reduce((acc, segment) => acc + segment.distance, 0)
)
const duration = computed(() =>
	segments.value.reduce((acc, segment) => acc + segment.duration, 0)
)
const steps = computed(() => segments.value.flatMap((segment) => segment.steps))

function formatDistance(distance: number) {
	if (distance >= 1000) {
		return `${(distance / 1000).toFixed(1)} km`
	}
	return `${distance} m`
}
function formatDuration(duration: number) {
	if (duration >= 3600) {
		return `${(duration / 3600).toFixed(2)} h`
	} else if (duration >= 60) {
		return `${(duration / 60).toFixed(1)} min`
	}
	return `${duration} sec`
}
</script>

<style scoped>
.routing-details-wrapper {
	margin-top: var(--kern-metric-space-small);

	.routing-details-header {
		display: flex;
		justify-content: center;
		gap: var(--kern-metric-space-small);
		margin-bottom: var(--kern-metric-space-small);
	}

	.kern-description-list-item {
		padding: var(--kern-metric-space-small);
		border-radius: var(--kern-metric-border-radius-default);
		background-color: var(--kern-color-layout-background-hued);
		white-space: break-spaces;
	}
}
</style>
