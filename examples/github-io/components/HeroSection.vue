<template>
	<section class="lp-hero" aria-label="Hero">
		<div class="lp-container">
			<!-- Navigation inside hero -->
			<nav class="lp-hero__nav" aria-label="Main navigation">
				<a href="#" class="lp-hero__nav-link" aria-current="page">
					<span
						class="kern-icon kern-icon--home"
						style="background-color: #fff"
					></span>
					Home
				</a>
				<a href="./docs/" class="lp-hero__nav-link">
					<span
						class="kern-icon kern-icon--draft"
						style="background-color: #fff"
					></span>
					Learn
				</a>
				<a
					href="https://polar.dataport.de/next/"
					target="_blank"
					rel="noopener"
					class="lp-hero__nav-link"
				>
					<span
						class="kern-icon kern-icon--arrow-forward"
						style="background-color: #fff"
					></span>
					Playground
				</a>
				<a
					href="./docs/"
					target="_blank"
					rel="noopener"
					class="lp-hero__nav-link"
				>
					<span
						class="kern-icon kern-icon--checklist"
						style="background-color: #fff"
					></span>
					Docs
				</a>
				<a
					href="https://github.com/Dataport/polar"
					target="_blank"
					rel="noopener"
					class="lp-hero__nav-link lp-hero__nav-link--github"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"
						/>
					</svg>
					Find us on GitHub
				</a>
			</nav>

			<!-- Hero content -->
			<div class="lp-hero__content">
				<h1 class="lp-hero__title">
					The configurable<br />
					&lt;map element solution /&gt;
				</h1>
				<p class="lp-hero__subtitle">
					reusable plugins &nbsp;&middot;&nbsp; extensible library
					&nbsp;&middot;&nbsp; KERN Design
				</p>

				<!-- Map preview -->
				<div class="lp-hero__map">
					<img
						:src="screenshotUrl"
						alt="POLAR Map Demo Screenshot"
						loading="lazy"
					/>
				</div>

				<!-- CTAs -->
				<div class="lp-hero__ctas">
					<a
						href="https://polar.dataport.de/next/"
						target="_blank"
						rel="noopener"
						class="kern-btn kern-btn--primary"
					>
						<span
							class="kern-icon kern-icon--arrow-forward"
							style="background-color: var(--polar-blue)"
						></span>
						<span class="kern-label">Try me out</span>
					</a>
					<a
						href="https://github.com/Dataport/polar"
						target="_blank"
						rel="noopener"
						class="kern-btn kern-btn--secondary"
					>
						<span
							class="kern-icon kern-icon--download"
							style="background-color: #fff"
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
	background: linear-gradient(
		135deg,
		var(--polar-hero-from) 0%,
		var(--polar-hero-to) 100%
	);
	color: #fff;
	padding: 3rem 0 4rem;
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
.lp-hero__content {
	text-align: center;
}
.lp-hero__title {
	font-size: clamp(2.25rem, 6vw, 5rem);
	font-weight: 700;
	line-height: 1.15;
	margin: 0 0 1rem;
}
.lp-hero__subtitle {
	font-size: clamp(1rem, 2.5vw, 1.5rem);
	opacity: 0.85;
	margin: 0 0 2.5rem;
}
.lp-hero__map {
	max-width: 900px;
	margin: 0 auto 2.5rem;
	border-radius: var(--polar-radius);
	overflow: hidden;
	box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
}
.lp-hero__map img {
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
.lp-hero :deep(.kern-btn--primary) {
	background: #fff;
}
.lp-hero :deep(.kern-btn--primary .kern-label) {
	color: var(--polar-blue);
}
.lp-hero :deep(.kern-btn--secondary) {
	border-color: rgba(255, 255, 255, 0.7);
}
.lp-hero :deep(.kern-btn--secondary .kern-label) {
	color: #fff;
}

@media (max-width: 600px) {
	.lp-hero__nav-link--github {
		margin-left: 0;
	}
}
</style>
