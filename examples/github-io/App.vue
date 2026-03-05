<template>
	<div class="kern-light">
		<!-- Shared background zone: header + hero sit on top of the SVG -->
		<div class="lp-hero-zone">
			<div v-html="heroBgSvg"></div>
			<TheHeader />
			<HeroSection />
		</div>
		<FeaturesSection />
		<UxSection />
		<DevExSection />
		<RoadmapSection />
		<CtaSection />
		<VideoSection />
		<TheFooter />
	</div>
</template>

<script setup lang="ts">
import kernExtraIcons from 'virtual:kern-extra-icons'
import heroBgSvg from './components/assets/hero-bg.svg?raw'

import CtaSection from './components/CtaSection.vue'
import DevExSection from './components/DevExSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HeroSection from './components/HeroSection.vue'
import RoadmapSection from './components/RoadmapSection.vue'
import TheFooter from './components/TheFooter.vue'
import TheHeader from './components/TheHeader.vue'
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
	--polar-green-100: #47FFB0;
	--polar-green-600: #171A2B;
	--polar-pink-100: #FFD6EA;
	--polar-pink-600: #B80064;
	--polar-blue-100: #D0E4FF;
	--polar-blue-500: #0078D4;
	--polar-blue-600: #0050A0;
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
	font-family: 'Fira Sans', var(--kern-typography-font-family-default, sans-serif);
	line-height: 1.6;
}

/* ── Hero zone ──────────────────────────────────────────── */
.lp-hero-zone {
	position: relative;
	background: #fff;
	overflow: hidden;
}
.lp-hero-zone__bg {
	position: absolute;
	inset: 0;
	width: 100%;
	height: auto;
	z-index: 0;
	pointer-events: none;
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

/* ── Grid layouts ───────────────────────────────────────── */
.lp-grid-3 {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.5rem;
}
.lp-grid-4 {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
}

/* ── KERN Card landing page overrides ───────────────────── */
.lp-card {
	border-radius: var(--polar-radius);
	border: 1px solid #e2e8f0;
	background: #fff;
	overflow: hidden;
}
.lp-card__icon-wrap {
	width: 3.5rem;
	height: 3.5rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1rem;
	background: #e8eeff;
}
.lp-card__title {
	font-size: 1.1rem;
	font-weight: 600;
	margin: 0 0 0.5rem;
}
.lp-card__body {
	font-size: 0.95rem;
	opacity: 0.75;
	margin: 0;
}

/* ── KERN badge extra variants ──────────────────────────── */
.kern-badge--accent {
	background: #ede9fe;
	border: 1px solid #7c3aed;
	color: #4c1d95;
}
.kern-badge--pink {
	background: #fce7f3;
	border: 1px solid #db2777;
	color: #831843;
}
.kern-badge--on-dark {
	background: rgba(255, 255, 255, 0.15);
	border: 1px solid rgba(255, 255, 255, 0.35);
	color: #fff;
}
.kern-badge--on-dark .kern-label {
	color: #fff;
}

/* ── Timeline ───────────────────────────────────────────── */
.lp-timeline {
	position: relative;
	padding-left: 2rem;
}
.lp-timeline::before {
	content: '';
	position: absolute;
	left: 0.625rem;
	top: 0;
	bottom: 0;
	width: 2px;
	background: #c7d2fe;
}
.lp-timeline-item {
	position: relative;
	margin-bottom: 2rem;
	padding-left: 1.5rem;
}
.lp-timeline-item::before {
	content: '';
	position: absolute;
	left: -1.5rem;
	top: 0.35rem;
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	background: var(--polar-blue);
	border: 2px solid #fff;
	box-shadow: 0 0 0 2px var(--polar-blue);
}
.lp-timeline-item--done::before {
	background: #15803d;
	box-shadow: 0 0 0 2px #15803d;
}
.lp-timeline-item--progress::before {
	background: #d97706;
	box-shadow: 0 0 0 2px #d97706;
}
.lp-timeline-item--planned::before {
	background: #94a3b8;
	box-shadow: 0 0 0 2px #94a3b8;
	opacity: 0.6;
}
.lp-timeline-item--planned {
	opacity: 0.55;
}
.lp-timeline-item__date {
	font-size: 0.78rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--polar-blue);
	margin-bottom: 0.25rem;
}
.lp-timeline-item__title {
	font-size: 1rem;
	font-weight: 600;
	margin: 0 0 0.25rem;
}
.lp-timeline-item__body {
	font-size: 0.9rem;
	opacity: 0.7;
	margin: 0;
}

/* ── UX checklist ───────────────────────────────────────── */
.lp-checklist {
	list-style: none;
	padding: 0;
	margin: 2rem 0 0;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.lp-checklist li {
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	font-size: 1rem;
}
.lp-checklist__check {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	min-width: 1.5rem;
	border-radius: 50%;
	background: #dcfce7;
	color: #15803d;
	font-size: 0.875rem;
	font-weight: 700;
}
.lp-section--dark .lp-checklist__check {
	background: #166534;
	color: #86efac;
}

/* ── CTA pills ──────────────────────────────────────────── */
.lp-cta-pills {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 0.75rem 2rem;
	margin-top: 3rem;
	font-size: 0.9rem;
	opacity: 0.8;
}
.lp-cta-pill::before {
	content: '● ';
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 600px) {
	.lp-timeline {
		padding-left: 1.25rem;
	}
}
</style>
