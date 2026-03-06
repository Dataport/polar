<template>
	<section class="lp-used-by" aria-label="Used by">
		<!-- eslint-disable-next-line vue/no-v-html -- safe: build-time ?raw SVG import -->
		<div class="lp-used-by__logo" v-html="usedByLogoSvg" />
	</section>
</template>

<script setup lang="ts">
import usedByLogoSvg from './assets/used-by-section-logo.svg?raw'
</script>

<style scoped>
.lp-used-by {
	padding: 2.5rem 0;
	background: #f7f7f9;
	overflow: hidden;
}
.lp-used-by__logo {
	display: block;
	width: 100%;
}
:deep(.lp-used-by__logo svg) {
	display: block;
	width: 100%;
	height: 192px;
}
</style>
