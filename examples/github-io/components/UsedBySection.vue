<template>
	<section class="lp-used-by" aria-label="Used by">
		<div class="lp-container">
			<!-- eslint-disable-next-line vue/no-v-html -- safe: build-time ?raw SVG import -->
			<div class="lp-used-by__logo" v-html="usedByLogoSvg" />
		</div>
	</section>
</template>

<script setup lang="ts">
import usedByLogoSvg from './assets/used-by-section-logo.svg?raw'
</script>

<style scoped>
.lp-used-by {
	padding: 2.5rem 0;
	background: #fff;
}
.lp-used-by__logo {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
