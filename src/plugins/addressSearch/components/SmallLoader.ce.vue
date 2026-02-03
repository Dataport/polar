<template>
	<div class="loader" role="status">
		<div />
		<div />
		<div />
		<div />
	</div>
</template>

<script setup lang="ts">
// Appease linter
</script>

<style scoped>
.loader,
.loader div {
	box-sizing: border-box;
}
.loader {
	position: absolute;
	right: calc(var(--kern-metric-space-x-large) * 1.5);
	width: var(--kern-metric-dimension-large);
	height: var(--kern-metric-dimension-large);
	margin: var(--kern-metric-space-small);
}
.loader div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: var(--kern-metric-dimension-large);
	height: var(--kern-metric-dimension-large);
	border: var(--kern-metric-border-width-bold) solid currentColor;
	border-radius: 50%;
	animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	border-color: currentColor transparent transparent transparent;
}
.loader div:nth-child(1) {
	animation-delay: -0.45s;
}
.loader div:nth-child(2) {
	animation-delay: -0.3s;
}
.loader div:nth-child(3) {
	animation-delay: -0.15s;
}
@keyframes loader {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
