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

:root {
	--polar-navy: #003087;
	--polar-blue: #003087;
	--polar-cyan: #00adef;
	--polar-hero-from: #00adef;
	--polar-hero-to: #003087;
	--polar-hero-accent: #39ff14;
	--polar-section-alt: #f8fafc;
	--polar-dark-bg: #111827;
	--polar-code-bg: #0d1117;
	--polar-radius: 8px;
	/* POLAR color tokens */
	--polar-pink-100: #ffd6ea;
	--polar-pink-450: #fc0c91;
	--polar-pink-600: #b80064;
	--polar-blue-100: #d0e4ff;
	--polar-blue-250: #7dbbfe;
	--polar-blue-300: #47b2ff;
	--polar-blue-400: #0794fa;
	--polar-blue-500: #0078d4;
	--polar-blue-600: #005fad;
	--polar-blue-850: #00264e;
	--polar-green-100: #47ffb0;
	--polar-green-250: #00d388;
	--polar-green-300: #00c37c;
	--polar-green-500: #008854;
	--polar-green-600: #006c42;
	--polar-grey-300: #a5aac3;
	--polar-grey-500: #6e7597;
	--polar-grey-600: #565c7f;
	--polar-text-default: #171a2b;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

body {
	margin: 0;
}

h3 {
	font-size: var(--kern-typography-font-size-adaptive-medium);
	font-weight: var(--kern-typography-font-weight-semi-bold);
	line-height: var(--kern-typography-line-height-adaptive-medium);
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
		font-size: var(--kern-typography-font-size-static-medium);
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
