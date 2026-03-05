<template>
	<section class="lp-used-by" aria-label="Used by">
		<div class="lp-container">
			<div v-html="usedByLogoSvg" class="lp-used-by__logo"></div>
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
