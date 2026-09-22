<template>
	<section class="lp-section lp-section--alt">
		<img :src="featuresBgSvg" alt="" />
		<SectionHeader
			badge="Features"
			badge-color="green"
			title="Everything you need for modern mapping"
			description="POLAR combines cutting-edge technology with ease of use, giving you the tools to create exceptional map-based applications."
		/>
	</section>
</template>

<script setup lang="ts">
import featuresBgSvg from './assets/features-bg.svg'
import SectionHeader from './SectionHeader.vue'
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
