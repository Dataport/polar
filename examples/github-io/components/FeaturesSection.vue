<template>
	<section
		class="lp-section lp-section--alt lp-features"
		aria-labelledby="features-heading"
	>
		<!-- eslint-disable-next-line vue/no-v-html -- safe: build-time ?raw SVG import -->
		<div v-html="featuresBgSvg" />
		<div class="lp-container">
			<div class="lp-section-header">
				<span class="lp-pill lp-pill--green" role="note">Features</span>
				<h2 id="features-heading">Everything you need for modern mapping</h2>
				<p>
					POLAR combines cutting-edge technology with ease of use, giving you
					the tools to create exceptional map-based applications.
				</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import featuresBgSvg from './assets/features-bg.svg?raw'
</script>

<style scoped>
.lp-features {
	position: relative;
	overflow: hidden;
	padding: 2rem 0;
}
:deep(.lp-features__bg) {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	pointer-events: none;
}
.lp-features .lp-container {
	position: relative;
	z-index: 1;
}
</style>
