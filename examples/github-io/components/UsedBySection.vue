<template>
	<section class="lp-used-by" aria-label="Used by">
		<img class="lp-used-by__logo" :src="usedByLogoSvg" alt="" />
	</section>
</template>

<script setup lang="ts">
import usedByLogoSvg from './assets/used-by-section-logo.svg'
</script>

<style scoped>
.lp-used-by {
	background: #21243a;
	overflow: hidden;
}
.lp-used-by__logo {
	display: block;
	width: 100%;
	height: auto;
}
</style>
