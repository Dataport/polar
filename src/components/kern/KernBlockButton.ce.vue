<template>
	<button
		class="kern-btn kern-btn--block kern-btn--tertiary"
		@click="$emit('click')"
	>
		<span v-if="icon" :class="`kern-icon ${icon}`" aria-hidden="true" />
		<span class="kern-label"><slot /></span>
	</button>
</template>

<script setup lang="ts">
import type { Icon } from '@/core'

defineProps<{ icon?: Icon }>()
defineEmits<{ click: [] }>()
</script>

<style scoped>
.kern-btn--tertiary {
	background-color: #edf1fa;
	justify-content: left;

	.kern-label {
		text-decoration: none;
	}
}
</style>
