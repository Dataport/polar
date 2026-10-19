<template>
	<section
		class="lp-section lp-section--brand lp-announcement"
		aria-labelledby="announcement-heading"
	>
		<img class="lp-announcement__bg" :src="ctaBgSvg" alt="" />
		<div class="lp-container lp-announcement__content">
			<div class="lp-announcement__copy">
				<Badge color="pink">Community News</Badge>
				<h2 id="announcement-heading">
					Support POLAR in the Open Source Competition
				</h2>
				<p>
					Your vote helps us continue building open, accessible, and reusable
					map applications for the web.
				</p>
			</div>
			<a
				href="https://open-source-wettbewerb.de/voting/polar/"
				target="_blank"
				rel="noopener"
				class="kern-btn kern-btn--primary lp-announcement__button"
			>
				<span class="kern-icon kern-icon--open-in-new" aria-hidden="true" />
				<span class="kern-label">Vote for POLAR</span>
			</a>
		</div>
	</section>
</template>

<script setup lang="ts">
import ctaBgSvg from './assets/cta-bg.svg'
import Badge from './Badge.vue'
</script>

<style scoped>
.lp-announcement {
	position: relative;
	overflow: hidden;
}

.lp-announcement__bg {
	position: absolute;
	inset: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.lp-announcement__content {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 2rem;
	padding-top: 2rem;
	padding-bottom: 2rem;
}

.lp-announcement__copy {
	min-width: 0;
	text-align: center;
}

h2 {
	margin: 0.75rem 0 0.5rem;
	color: var(--kern-color-layout-text-inverse);
	font-size: var(--kern-typography-font-size-large-adaptive);
	line-height: var(--kern-typography-line-height-large-adaptive);
}

p {
	max-width: 42rem;
	margin: 0;
	color: rgba(255, 255, 255, 0.85);
}

.lp-announcement__button {
	flex-shrink: 0;
	background: #fff;

	.kern-icon {
		background-color: var(--polar-blue-600);
	}

	.kern-label {
		color: var(--polar-blue-600);
	}
}

.lp-announcement__button:hover,
.lp-announcement__button:focus-visible {
	background: #fff !important;

	.kern-icon {
		background-color: var(--polar-blue-600);
	}

	.kern-label {
		color: var(--polar-blue-600);
	}
}

@media (max-width: 768px) {
	.lp-announcement__content {
		gap: 1.5rem;
	}

	.lp-announcement__button {
		width: min(100%, 18rem);
	}
}
</style>
