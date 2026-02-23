<template>
	<button
		class="kern-btn kern-btn--block kern-btn--tertiary"
		@click="emit('click')"
	>
		<span
			v-if="props.icon"
			:class="{ 'kern-icon': true, [props.icon]: true }"
			aria-hidden="true"
		/>
		<span class="kern-label">{{ props.label }}</span>
	</button>
</template>

<script setup lang="ts">
import type { Icon } from '@/core'

const props = defineProps<{
	icon?: Icon | false
	label: string
}>()

const emit = defineEmits<{
	click: []
}>()
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
