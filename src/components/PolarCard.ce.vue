<template>
	<article class="kern-card kern-card--small">
		<div class="kern-card__container">
			<slot />
		</div>
	</article>
</template>

<script setup lang="ts">
// NOTE: This comment is needed to have the <script>-tag not empty
</script>

<style scoped>
.kern-card {
	height: inherit;
	min-width: 25rem;
	border-radius: 0.5rem;
	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);

	.kern-card__container {
		padding: var(--kern-metric-space-small);
		padding-bottom: 0.625rem;
	}
}
</style>
