<template>
	<!-- TODO: automatically adjust to active tool/mode, this is filler -->
	<section class="draw-help">
		<p class="kern-body">In this section, we explain the currently active tool a little. Mhhh, yes.</p>

		<span class="kern-badge kern-badge--info">
			<span class="kern-icon kern-icon--mouse" aria-hidden="true" />
			<span class="kern-label">Klick - Zeichnen</span>
		</span>
		<span class="kern-badge kern-badge--info">
			<span class="kern-icon kern-icon--blind" aria-hidden="true" />
			<span class="kern-label">When bugs</span>
		</span>
		<span class="kern-badge kern-badge--info">
			<span class="kern-icon kern-icon--mouse" aria-hidden="true" />
			<span class="kern-label">Doppelklick - Zeichnen abschließen</span>
		</span>
		<span class="kern-badge kern-badge--info">
			Alt+<span class="kern-icon kern-icon--mouse" aria-hidden="true" />
			<span class="kern-label">Delete edge</span>
		</span>
	</section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.draw-help {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--kern-metric-dimension-2x-small);

	.kern-body {
		white-space: normal;
	}
}
</style>
