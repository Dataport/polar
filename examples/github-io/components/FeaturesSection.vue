<template>
	<section class="lp-section lp-section--alt">
		<img :src="featuresBgSvg" alt="" />
		<div class="lp-section-header">
			<TheBadge color="green">Features</TheBadge>
			<h3>Everything you need for modern mapping</h3>
			<p>
				POLAR combines cutting-edge technology with ease of use, giving you the
				tools to create exceptional map-based applications.
			</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import featuresBgSvg from './assets/features-bg.svg'
import TheBadge from './TheBadge.vue'
</script>

<style scoped>
section {
	position: relative;

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	p {
		color: var(--kern-color-layout-text-muted);
	}
}
</style>
