<template>
	<section class="lp-used-by" aria-label="Used by">
		<!-- eslint-disable-next-line vue/no-v-html -- safe: build-time ?raw SVG import -->
		<div class="lp-used-by__logo" v-html="usedByLogoSvg" />
	</section>
</template>

<script setup lang="ts">
import rawSvg from './assets/used-by-section-logo.svg?raw'

// Replace the SVG's fixed 1728px width with 100% so it always fills its container.
const usedByLogoSvg = rawSvg.replace('width="1728"', 'width="100%"')
</script>

<style scoped>
.lp-used-by {
	background: #21243a;
	overflow: hidden;
}
.lp-used-by__logo {
	display: block;
	width: 100%;
}
:deep(.lp-used-by__logo svg) {
	display: block;
	width: 100%;
	height: auto;
}
</style>
