<template>
	<section class="polar-filter-section">
		<h3 class="kern-heading-small">{{ props.title }}</h3>
		<slot />
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string
}>()
</script>

<style scoped>
.polar-filter-section {
	width: 100%;

	h3 {
		padding-left: 0.15em;
	}
}
</style>
