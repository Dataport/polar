<template>
	<div class="routing-live-region">
		<hr class="kern-divider" aria-hidden="true" />
		<span role="status" aria-live="polite">
			{{
				$t(($) => $.ariaLive, {
					ns: PluginId,
					steps: steps.length,
					duration: formatDuration(duration),
					distance: formatDistance(distance),
				})
			}}
		</span>
	</div>
	<section v-show="showDetails">
		<div class="routing-details-header">
			<h3>{{ $t(($) => $.label.details, { ns: PluginId }) }}</h3>
			<span aria-hidden="true">
				{{
					$t(($) => $.duration, {
						ns: PluginId,
						duration: formatDuration(duration),
					})
				}}
			</span>
			<span aria-hidden="true">
				{{
					$t(($) => $.distance, {
						ns: PluginId,
						distance: formatDistance(distance),
					})
				}}
			</span>
		</div>
		<ol :aria-label="$t(($) => $.label.steps, { ns: PluginId })">
			<li v-for="(step, i) in steps" :key="i">
				<span class="routing-instruction">
					{{ step.instruction }}
				</span>
				<div class="routing-badges">
					<span
						class="kern-badge"
						:aria-label="
							$t(($) => $.duration, {
								ns: PluginId,
								duration: formatDuration(step.duration),
							})
						"
					>
						<span class="kern-icon kern-icon--pace" aria-hidden="true" />
						<span class="kern-label" aria-hidden="true">
							{{ formatDuration(step.duration) }}
						</span>
					</span>
					<span
						class="kern-badge"
						:aria-label="
							$t(($) => $.distance, {
								ns: PluginId,
								distance: formatDistance(step.distance),
							})
						"
					>
						<span class="kern-icon kern-icon--arrow-range" aria-hidden="true" />
						<span class="kern-label" aria-hidden="true">
							{{ formatDistance(step.distance) }}
						</span>
					</span>
				</div>
			</li>
		</ol>
	</section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useRoutingStore } from '../store.ts'
import { PluginId } from '../types'

const routingStore = useRoutingStore()
const { showDetails } = storeToRefs(routingStore)

const segments = computed(
	() => routingStore.routeFeature?.properties.segments ?? []
)
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
.routing-live-region {
	position: relative;
	width: 100%;

	hr {
		width: 100%;
	}

	span {
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
		margin: calc(-1 * var(--kern-metric-space-small)) 0;
	}
}

section {
	margin-top: var(--kern-metric-space-small);

	.routing-details-header {
		position: relative;
		display: flex;
		justify-content: center;
		gap: var(--kern-metric-space-small);
		margin-bottom: var(--kern-metric-space-small);

		h3 {
			position: absolute;
			inset: 0;
			opacity: 0;
			pointer-events: none;
			margin: 0;
		}

		span {
			font-size: var(--kern-typography-font-size-medium-static);
		}
	}

	ol {
		display: flex;
		flex-direction: column;
		gap: var(--kern-metric-space-small);
		padding: 0;

		li {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: var(--kern-metric-space-small);
			padding: var(--kern-metric-space-small);
			padding-left: var(--kern-metric-space-default);
			border-radius: var(--kern-metric-border-radius-default);
			background-color: var(--kern-color-layout-background-hued);
			white-space: break-spaces;
			word-break: break-word;

			.routing-instruction {
				font-weight: var(--kern-typography-font-weight-label-default);
				color: var(--kern-color-layout-text-default);
			}

			.routing-badges {
				display: flex;
				gap: var(--kern-metric-space-small);
				width: 100%;
				color: var(--kern-color-layout-text-default);

				.kern-badge {
					box-sizing: content-box;
					justify-content: center;
					width: var(--kern-metric-dimension-5x-large);
					border: var(--kern-metric-border-width-light) solid
						var(--kern-color-decorative-border-contextual);
				}
			}
		}
	}
}
</style>
