<template>
	<section class="lp-hero" aria-label="Hero">
		<!-- Decorative star placeholders – replace src with designer assets -->
		<div class="lp-hero__stars" aria-hidden="true">
			<!-- star assets will go here once provided by designer -->
		</div>

		<div class="lp-container">
			<!-- Hero content -->
			<div class="lp-hero__content">
				<h1 class="lp-hero__title">
					<span>The <span class="lp-hero__title-spartan lp-hero__title-mint">configurable</span></span><br />
					<span><span class="lp-hero__title-mint">&lt;</span>map element solution <span class="lp-hero__title-mint">/&gt;</span></span>
				</h1>
				<p class="lp-hero__subtitle">
					reusable plugins <span class="lp-hero__subtitle-dot">&nbsp;&middot;&nbsp;</span> extensible library
					<span class="lp-hero__subtitle-dot">&nbsp;&middot;&nbsp;</span> KERN Design
				</p>

				<!-- Map preview -->
				<div class="lp-hero__map">
					<div class="lp-hero__map-frame">
						<img
							:src="screenshotUrl"
							alt="POLAR Map Demo Screenshot"
							loading="lazy"
						/>
					</div>
				</div>

				<!-- CTAs -->
				<div class="lp-hero__ctas">
					<a
						href="https://polar.dataport.de/next/"
						target="_blank"
						rel="noopener"
						class="kern-btn kern-btn--primary lp-hero__cta-try"
					>
						<span
							class="kern-icon kern-icon--ar-stickers"
							aria-hidden="true"
						></span>
						<span class="kern-label">Try me out</span>
					</a>
					<a
						href="https://github.com/Dataport/polar"
						target="_blank"
						rel="noopener"
						class="kern-btn kern-btn--secondary lp-hero__cta-download"
					>
						<span
							class="kern-icon kern-icon--open-in-new"
							aria-hidden="true"
						></span>
						<span class="kern-label">Download</span>
					</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import screenshotUrl from '../../../docs/assets/polar_example_screenshot.png'
</script>

<style scoped>
.lp-hero {
	position: relative;
	z-index: 1;
	background: transparent;
	color: #fff;
	padding: 0 0 0;
	overflow: hidden;
}
.lp-hero__stars {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;
}
.lp-hero__stars img {
	position: absolute;
}
.lp-hero__nav {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5rem 1.5rem;
	margin-bottom: 3rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}
.lp-hero__nav-link {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	color: rgba(255, 255, 255, 0.9);
	text-decoration: none;
	font-size: 1rem;
	transition: color 0.2s;
}
.lp-hero__nav-link:hover {
	color: #fff;
}
.lp-hero__nav-link--github {
	margin-left: auto;
	background: rgba(255, 255, 255, 0.15);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: var(--polar-radius);
	padding: 0.4rem 0.9rem;
}
.lp-hero .lp-container {
	position: relative;
	z-index: 1;
	padding: 1rem 1.5rem 4rem;
}
.lp-hero__content {
	text-align: center;
}
.lp-hero__title {
	font-family: 'Fira Sans', sans-serif;
	font-size: clamp(2.25rem, 6vw, 5rem);
	font-weight: 600;
	line-height: 1.15;
	margin: 0 0 1rem;
	color: #F7F7F9;
	text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}
.lp-hero__title-spartan {
	font-family: 'League Spartan', sans-serif;
	font-weight: 400;
}
.lp-hero__title-mint {
	color: #47FFB0;
}
.lp-hero__subtitle {
	font-family: 'Fira Sans', sans-serif;
	font-size: clamp(1rem, 2.5vw, 1.5rem);
	font-weight: 600;
	color: #F7F7F9;
	opacity: 0.85;
	margin: 0 0 2.5rem;
	text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.lp-hero__subtitle-dot {
	color: #47FFB0;
	font-size: 1.25em;
	vertical-align: middle;
}
.lp-hero__map {
	max-width: 960px;
	margin: 0 auto 2.5rem;
}
.lp-hero__map-frame {
	background: #fff;
	border-radius: 1.5rem;
	overflow: hidden;
	box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45);
}
.lp-hero__map-frame img {
	width: 100%;
	display: block;
}
.lp-hero__ctas {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

/* Invert KERN btn colours for dark hero background */
.lp-hero :deep(.lp-hero__cta-try.kern-btn--primary) {
	background: #1A3DA5;
}
.lp-hero :deep(.lp-hero__cta-try.kern-btn--primary .kern-label) {
	color: #fff;
}
.lp-hero :deep(.lp-hero__cta-try.kern-btn--primary .kern-icon) {
	background-color: #fff;
}
.lp-hero :deep(.lp-hero__cta-download.kern-btn--secondary) {
	background: #fff;
	border-color: #1A3DA5;
}
.lp-hero :deep(.lp-hero__cta-download.kern-btn--secondary .kern-label) {
	color: #1A3DA5;
}
.lp-hero :deep(.lp-hero__cta-download.kern-btn--secondary .kern-icon) {
	background-color: #1A3DA5;
}

.lp-hero__wave {
	display: none;
}
</style>
