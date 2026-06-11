<template>
	<button class="kern-btn" @click="$emit('click')">
		<span v-if="icon" class="kern-icon" :class="icon" aria-hidden="true" />
		<span class="kern-label" :class="{ 'kern-sr-only': labelSrOnly }">
			<slot />
		</span>
	</button>
</template>

<script setup lang="ts">
import type { Icon } from '@/core'

defineProps<{ icon?: Icon; labelSrOnly?: boolean }>()
defineEmits(['click'])
</script>

<style scoped>
.kern-icon {
	background-color: var(
		--kern-btn-text-color,
		var(--kern-color-action-default-contextual)
	);
}

.kern-label {
	color: var(
		--kern-btn-text-color,
		var(--kern-color-action-default-contextual)
	);
}

.kern-btn--primary {
	.kern-icon {
		background-color: var(
			--kern-btn-text-color,
			var(--kern-color-action-on-default-contextual)
		);
	}
	.kern-label {
		color: var(
			--kern-btn-text-color,
			var(--kern-color-action-on-default-contextual)
		);
	}
}
</style>
