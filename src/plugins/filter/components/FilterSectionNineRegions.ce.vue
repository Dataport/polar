<template>
	<details class="kern-accordion">
		<summary class="kern-accordion__header">
			<span class="kern-title">{{ props.title }}</span>
		</summary>
		<section class="kern-accordion__body">
			<slot />
		</section>
	</details>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string
}>()
</script>

<style scoped>
.kern-accordion__header {
	padding: var(--kern-metric-space-x-small);

	.kern-title {
		color: black;
		font-weight: normal;
		font-size: 1.2em;
	}
}
</style>
