<template>
	<div class="kern-light">
		<!-- Shared background zone: header + hero sit on top of the SVG -->
		<div class="lp-hero-zone">
			<div class="lp-hero-decorations" aria-hidden="true">
				<img
					src="./components/assets/polar-header-bear.svg"
					class="lp-hero-bear"
					alt=""
				/>
				<img
					src="./components/assets/polar-header-star.svg"
					class="lp-hero-star"
					alt=""
				/>
			</div>
			<TheHeader />
			<HeroSection />
		</div>
		<FeaturesSection />
		<UxSection />
		<DevExSection />
		<UsedBySection />
		<RoadmapSection />
		<CtaSection />
		<VideoSection />
		<TheFooter />
	</div>
</template>

<script setup lang="ts">
import kernExtraIcons from 'virtual:kern-extra-icons'

import CtaSection from './components/CtaSection.vue'
import DevExSection from './components/DevExSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HeroSection from './components/HeroSection.vue'
import RoadmapSection from './components/RoadmapSection.vue'
import TheFooter from './components/TheFooter.vue'
import TheHeader from './components/TheHeader.vue'
import UsedBySection from './components/UsedBySection.vue'
import UxSection from './components/UxSection.vue'
import VideoSection from './components/VideoSection.vue'

document.adoptedStyleSheets.push(kernExtraIcons)
if (import.meta.hot) {
	import.meta.hot.on('kern-extra-icons', ({ icons }: { icons: string[] }) => {
		icons.forEach((icon) => kernExtraIcons.insertRule(icon))
	})
}
</script>

<!-- ── Global: KERN design system ───────────────────────────────── -->
<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400&family=Fira+Code:wght@400&display=swap');
@import url('@kern-ux/native/dist/kern.css');
@import url('@kern-ux/native/dist/fonts/fira-sans.css');
@import url('./variables.css');

*,
*::before,
*::after {
	box-sizing: border-box;
}

body {
	margin: 0;
}

h3 {
	font-size: var(--kern-typography-font-size-medium-adaptive);
	font-weight: var(--kern-typography-font-weight-semi-bold);
	line-height: var(--kern-typography-line-height-medium-adaptive);
}

/* ── Hero zone ──────────────────────────────────────────── */
.lp-hero-zone {
	position: relative;
	background-image: url('./components/assets/polar-header-bg.svg');
	background-size: cover;
	background-position: top -175px center;
	background-repeat: no-repeat;
	overflow: hidden;
}

.lp-hero-decorations {
	position: absolute;
	inset: 0;
	pointer-events: none;
	mask-image: url('./components/assets/polar-header-bg.svg');
	mask-size: cover;
	mask-position: top center;
	mask-repeat: no-repeat;
}

.lp-hero-bear {
	position: absolute;
	left: -12%;
	top: 0;
	width: 40%;
	filter: brightness(0) invert(1);
}

.lp-hero-star {
	position: absolute;
	right: 0%;
	top: 0%;
	width: 30%;
	filter: brightness(0) invert(1);
}

/* ── Layout helpers ─────────────────────────────────────── */
.lp-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1.5rem;
}

/* ── Section shared ─────────────────────────────────────── */
.lp-section {
	padding: 2rem 0;
}
.lp-section--alt {
	background: var(--polar-section-alt);
}
.lp-section--brand {
	background: linear-gradient(
		135deg,
		var(--polar-hero-from) 0%,
		var(--polar-hero-to) 100%
	);
	color: #fff;
	text-align: center;
}

.lp-section-header {
	text-align: center;
	margin-bottom: 1rem;

	p {
		font-size: var(--kern-typography-font-size-medium-static);
		width: 54rem;
		margin: 0 auto;

		@media (max-width: 768px) {
			width: 100%;
			padding: 0 1rem;
		}
	}
}
.lp-section-header--left {
	text-align: left;

	p {
		margin: 0;
	}
}
</style>
