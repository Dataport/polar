<template>
	<section
		class="lp-section lp-section--brand lp-cta"
		aria-labelledby="cta-heading"
	>
		<img class="lp-cta__bg" :src="ctaBgSvg" alt="" />
		<div class="lp-container lp-cta__content">
			<span class="lp-pill lp-pill--green" role="note">Get started today</span>
			<h2 id="cta-heading" class="lp-cta__heading">
				Ready to Build Amazing Map Applications?
			</h2>
			<p class="lp-cta__lead">
				Join the growing community of developers and public administrations
				using POLAR to deliver modern, accessible map experiences.
			</p>
			<div class="lp-cta__actions">
				<a
					href="https://polar.dataport.de/next/"
					target="_blank"
					rel="noopener"
					class="kern-btn kern-btn--primary lp-cta__btn--primary"
				>
					<span class="kern-icon kern-icon--ar-stickers" aria-hidden="true" />
					<span class="kern-label">Try me out</span>
				</a>
				<a
					href="https://github.com/Dataport/polar"
					target="_blank"
					rel="noopener"
					class="kern-btn kern-btn--secondary lp-cta__btn--secondary"
				>
					<span class="kern-icon kern-icon--open-in-new" aria-hidden="true" />
					<span class="kern-label">Download</span>
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
import ctaBgSvg from './assets/cta-bg.svg'
</script>

<style scoped>
.lp-cta {
	position: relative;
	overflow: hidden;
}
.lp-cta__bg {
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

/* ── CTA copy ──────────────────────────────────────────── */
.lp-cta__heading {
	margin-top: 0.75rem;
}

.lp-cta__lead {
	max-width: 680px;
	margin: 0.5rem auto 2.5rem;
	font-size: 1.1rem;
	opacity: 0.85;
}

.lp-cta__actions {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

/* ── CTA button overrides ──────────────────────────────── */
.lp-cta__btn--primary {
	background: #fff;
}

.lp-cta__btn--primary .kern-icon {
	background-color: var(--polar-blue);
}

.lp-cta__btn--primary .kern-label {
	color: var(--polar-blue);
}

.lp-cta__btn--secondary {
	border-color: rgba(255, 255, 255, 0.7);
}

.lp-cta__btn--secondary .kern-icon {
	background-color: #fff;
}

.lp-cta__btn--secondary .kern-label {
	color: #fff;
}
</style>
