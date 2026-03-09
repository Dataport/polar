<template>
	<div class="kern-light">
		<!-- Shared background zone: header + hero sit on top of the SVG -->
		<div class="lp-hero-zone">
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
	--polar-green-100: #47ffb0;
	--polar-green-600: #171a2b;
	--polar-pink-100: #ffd6ea;
	--polar-pink-600: #b80064;
	--polar-blue-100: #d0e4ff;
	--polar-blue-500: #0078d4;
	--polar-blue-600: #0050a0;
}

/* ── Shared pill component ──────────────────────────────── */
.lp-pill {
	display: inline-flex;
	align-items: center;
	padding: 0.3rem 1rem;
	border-radius: 9999px;
	font-size: 0.875rem;
	font-weight: 600;
	border: none;
	line-height: 1.4;
}
.lp-pill--green {
	background: var(--polar-green-100);
	color: var(--polar-green-600);
}
.lp-pill--pink {
	background: var(--polar-pink-100);
	color: var(--polar-pink-600);
}
.lp-pill--blue {
	background: var(--polar-blue-100);
	color: var(--polar-blue-600);
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

body {
	margin: 0;
	background: #fff;
	color: #1a1a2e;
	font-family:
		'Fira Sans', var(--kern-typography-font-family-default, sans-serif);
	line-height: 1.6;
}

/* ── Hero zone ──────────────────────────────────────────── */
.lp-hero-zone {
	position: relative;
	background: #fff;
	background-image: url('./components/assets/polar-bg.svg');
	background-size: cover;
	background-position: top center;
	background-repeat: no-repeat;
	overflow: hidden;
}

/* ── Layout helpers ─────────────────────────────────────── */
.lp-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1.5rem;
}

/* ── Section shared ─────────────────────────────────────── */
.lp-section {
	padding: 5rem 0;
}
.lp-section--alt {
	background: var(--polar-section-alt);
}
.lp-section--dark {
	background: var(--polar-dark-bg);
	color: #e5e7eb;
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
	margin-bottom: 3rem;
}
.lp-section-header--left {
	text-align: left;
}
.lp-section-header h2 {
	font-size: clamp(1.75rem, 4vw, 2.75rem);
	font-weight: 700;
	margin: 0.75rem 0 1rem;
	color: inherit;
}
.lp-section-header p {
	font-size: 1.1rem;
	opacity: 0.75;
	max-width: 680px;
	margin: 0 auto;
}
.lp-section-header--left p {
	margin: 0;
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 600px) {
}
</style>
