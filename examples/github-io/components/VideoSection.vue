<template>
	<section class="lp-section" aria-labelledby="video-heading">
		<div class="lp-container" style="text-align: center">
			<span class="kern-badge kern-badge--info" role="note">
				<span class="kern-label">Hear us talk</span>
			</span>
			<h2 id="video-heading" style="margin-top: 0.75rem">
				Our FOSSGIS Adventure.
			</h2>
			<p style="max-width: 640px; margin: 0.5rem auto 2rem; color: #475569">
				2023 we gave a small talk at FOSSGIS about ...
			</p>
			<div ref="videoWrap" class="lp-video-wrap">
				<template v-if="!videoPlaying">
					<img
						:src="mapsPin"
						alt="POLAR FOSSGIS 2023 talk thumbnail"
						class="lp-video-thumb"
					/>
					<button
						class="lp-video-play"
						aria-label="Play FOSSGIS 2023 talk"
						@click="videoPlaying = true"
					>
						<span style="margin-left: 4px">&#9654;</span>
					</button>
				</template>
				<iframe
					v-else
					class="lp-video-iframe"
					src="https://media.ccc.de/v/fossgis2023-24143-polar-ein-konfigurierbarer-kartenclient/oembed"
					frameborder="0"
					allowfullscreen
					title="POLAR - FOSSGIS 2023 talk"
				></iframe>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import mapsPin from '../../../docs/assets/maps_pin.jpg'

const videoPlaying = ref(false)
const videoWrap = ref<HTMLElement | null>(null)
</script>

<style scoped>
.lp-video-wrap {
	position: relative;
	max-width: 800px;
	margin: 0 auto;
	border-radius: var(--polar-radius);
	overflow: hidden;
	aspect-ratio: 16 / 9;
	background: #000;
}
.lp-video-thumb {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	filter: brightness(0.7);
}
.lp-video-play {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	color: #fff;
	background: rgba(0, 0, 0, 0.5);
	border: none;
	cursor: pointer;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	transition: background 0.2s;
}
.lp-video-play:hover {
	background: rgba(26, 61, 165, 0.85);
}
.lp-video-iframe {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
