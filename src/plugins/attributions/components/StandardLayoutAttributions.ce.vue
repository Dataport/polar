<template>
	<AttributionContent
		v-if="windowIsOpen"
		class="polar-plugin-attributions-content"
	/>
	<button
		class="kern-btn kern-btn--tertiary"
		:class="{ 'kern-btn-active': windowIsOpen }"
		@click="toggleMapInfo"
	>
		<span class="kern-icon" :class="mapInfoIcon" aria-hidden="true" />
		<span class="kern-label kern-sr-only">
			{{
				$t(($) => $.button[`${windowIsOpen ? 'close' : 'open'}Title`], {
					ns: PluginId,
				})
			}}
		</span>
	</button>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { PluginId } from '@/plugins/attributions'
import AttributionContent from '@/plugins/attributions/components/AttributionContent.ce.vue'

import { useAttributionsStore } from '../store'

const { mapInfoIcon, windowIsOpen } = storeToRefs(useAttributionsStore())

function toggleMapInfo() {
	windowIsOpen.value = !windowIsOpen.value
}
</script>

<style scoped>
.polar-plugin-attributions-content {
	position: absolute;
	bottom: 2.5rem;
	right: 0;
}
.kern-btn {
	width: var(--kern-metric-dimension-large);
	min-height: var(--kern-metric-dimension-large);

	.kern-icon {
		color: var(--kern-color-action-default);
	}
}

.kern-btn-active {
	background: color-mix(
		in oklch,
		var(--kern-color-action-default) 12%,
		transparent
	);
}
</style>
