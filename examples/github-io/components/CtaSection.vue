<template>
	<section
		class="lp-section lp-section--brand lp-cta"
		aria-labelledby="cta-heading"
	>
		<!-- eslint-disable-next-line vue/no-v-html -- safe: build-time ?raw SVG import -->
		<div v-html="ctaBgSvg" />
		<div class="lp-container lp-cta__content">
			<span class="lp-pill lp-pill--green" role="note">Get started today</span>
			<h2 id="cta-heading" style="margin-top: 0.75rem">
				Ready to Build Amazing Map Applications?
			</h2>
			<p
				style="
					max-width: 680px;
					margin: 0.5rem auto 2.5rem;
					font-size: 1.1rem;
					opacity: 0.85;
				"
			>
				Join the growing community of developers and public administrations
				using POLAR to deliver modern, accessible map experiences.
			</p>
			<div
				style="
					display: flex;
					justify-content: center;
					gap: 1rem;
					flex-wrap: wrap;
				"
			>
				<a
					href="https://polar.dataport.de/next/"
					target="_blank"
					rel="noopener"
					class="kern-btn kern-btn--primary"
					style="background: #fff"
				>
					<span
						class="kern-icon kern-icon--ar-stickers"
						style="background-color: var(--polar-blue)"
					/>
					<span class="kern-label" style="color: var(--polar-blue)">
						Try me out
					</span>
				</a>
				<a
					href="https://github.com/Dataport/polar"
					target="_blank"
					rel="noopener"
					class="kern-btn kern-btn--secondary"
					style="border-color: rgba(255, 255, 255, 0.7)"
				>
					<span
						class="kern-icon kern-icon--open-in-new"
						style="background-color: #fff"
					/>
					<span class="kern-label" style="color: #fff">Download</span>
				</a>
			</div>
			<div class="lp-cta-pills" aria-label="Key properties">
				<span class="lp-cta-pill">EUPL license</span>
				<span class="lp-cta-pill">Active Development</span>
				<span class="lp-cta-pill">Community Support</span>
				<span class="lp-cta-pill">KERN Compliant</span>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import rawCtaBg from './assets/features-bg.svg?raw'

// Strip existing opacity attrs (they vary per-path and would multiply),
// then apply a flat #404565 at 48% so all icons render uniformly.
const ctaBgSvg = rawCtaBg
	.replace(/\s*opacity="[0-9.]+"/g, '')
	.replace(/fill="#404565"/g, 'fill="rgba(64,69,101,0.48)"')
</script>

<style scoped>
.lp-cta {
	position: relative;
	overflow: hidden;
}
:deep(.lp-features__bg) {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	pointer-events: none;
}
.lp-cta__content {
	position: relative;
	z-index: 1;
}

/* ── CTA pills ─────────────────────────────────────────── */
.lp-cta-pills {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 0.75rem 2rem;
	margin-top: 3rem;
	font-size: 1.2em;
	color: rgba(255, 255, 255, 0.8);
}
.lp-cta-pill {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}
.lp-cta-pill::before {
	content: '';
	display: inline-block;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #15e192;
	flex-shrink: 0;
}
</style>
