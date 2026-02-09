<template>
	<article class="kern-card kern-card--small" tabindex="-1">
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
	border-radius: var(--kern-metric-border-radius-large);
	box-shadow: var(--polar-shadow);

	.kern-card__container {
		padding: var(--kern-metric-space-small);
		padding-bottom: 0.625rem;
	}
}
</style>
