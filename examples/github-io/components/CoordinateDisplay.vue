<template>
	<div v-if="latLon" class="lp-coordinate-display">
		<span class="lp-coordinate-display__text">
			{{ formatCoord(latLon[1]) }} | {{ formatCoord(latLon[0]) }}
		</span>
		<span aria-hidden="true"> · </span>
		<span class="lp-coordinate-display__epsg">EPSG:4326</span>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePinsStore } from '@/plugins/pins/store'

const { latLon } = storeToRefs(usePinsStore())

function formatCoord(value: number): string {
	return value.toFixed(5)
}
</script>

<style scoped>
.lp-coordinate-display {
	display: flex;
	align-items: center;
	font-size: 0.8125rem;
}

.lp-coordinate-display__text {
	font-variant-numeric: tabular-nums;
}

.lp-coordinate-display__epsg {
	color: var(--kern-color-action-default);
	font-weight: 600;
}
</style>
