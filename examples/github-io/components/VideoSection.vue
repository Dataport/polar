<template>
	<section class="lp-section lp-section--video" aria-labelledby="video-heading">
		<div class="lp-container lp-video__container">
			<TheBadge color="dark-blue">Media</TheBadge>
			<h3 id="video-heading" class="lp-video__heading">
				FOSSGIS 2024 (German)
			</h3>
			<p class="lp-video__lead">
				Watch our latest talk for a comprehensive explanation of architecture
				and configuration.
			</p>
			<div class="video-container">
				<iframe
					class="lp-video-iframe"
					src="https://media.ccc.de/v/fossgis2024-38921-polar-vollkonfigurierbare-pluginbasierte-kartenklienten-fr-brgernahe-anwendungen/oembed"
					allowfullscreen
					title="POLAR - FOSSGIS 2024 talk"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import TheBadge from './TheBadge.vue'
</script>

<style scoped>
.video-container {
	max-width: 1024px;
	margin: auto;
	border-radius: var(--polar-radius);
	aspect-ratio: 16 / 9;
	background: #000;
}
.lp-video-iframe {
	width: 100%;
	height: 100%;
	border: none;
}
.lp-section--video {
	background-color: #000;
}

.lp-video__container {
	text-align: center;
}

.lp-video__heading {
	margin-top: 0.75rem;
	color: #eff0f4;
}

.lp-video__lead {
	max-width: 640px;
	margin: 0.5rem auto 2rem;
	color: #a5aac3;
}
</style>
