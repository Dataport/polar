<template>
	<footer class="lp-footer" role="contentinfo">
		<div class="lp-container">
			<p>
				&copy; 2024&ndash;2026
				<a href="https://www.dataport.de" target="_blank" rel="noopener"
					>Dataport AöR</a
				>
				&nbsp;&middot;&nbsp;
				<a href="./docs/legal-notice/" target="_blank" rel="noopener"
					>Legal Notice</a
				>
				&nbsp;&middot;&nbsp; Licensed under
				<a
					href="https://joinup.ec.europa.eu/collection/eupl"
					target="_blank"
					rel="noopener"
					>EUPL-1.2</a
				>
				&nbsp;&middot;&nbsp;
				<a
					href="https://github.com/Dataport/polar"
					target="_blank"
					rel="noopener"
					>GitHub</a
				>
			</p>
		</div>
	</footer>
</template>

<script setup lang="ts">
// Static template component — no reactive state
</script>

<style scoped>
.lp-footer {
	background: var(--polar-navy);
	color: rgba(255, 255, 255, 0.6);
	text-align: center;
	padding: 1.5rem;
	font-size: 0.85rem;
}
.lp-footer a {
	color: rgba(255, 255, 255, 0.75);
}
</style>
