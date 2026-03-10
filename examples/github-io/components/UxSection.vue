<template>
	<section class="lp-section" aria-labelledby="ux-heading">
		<div class="lp-container">
			<div class="lp-section-header">
				<span class="lp-pill lp-pill--pink" role="note">User Experience</span>
				<h2 id="ux-heading">Built for humans, by humans who care!</h2>
				<p>
					POLAR is designed with user experience at its core, ensuring your
					mapping applications are accessible, responsive, and delightful to
					use.
				</p>
			</div>

			<div class="lp-grid-4">
				<article
					v-for="card in cards"
					:key="card.title"
					class="kern-card lp-card"
				>
					<div class="kern-card__container lp-card__container">
						<!-- eslint-disable-next-line vue/no-v-html -- safe: build-time ?raw SVG import -->
						<div class="lp-card__img" aria-hidden="true" v-html="card.svg" />
						<h3 class="lp-card__title">{{ card.title }}</h3>
						<p class="lp-card__body">{{ card.body }}</p>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import accessibleSvg from './assets/ux-accessible.svg?raw'
import flexibleSvg from './assets/ux-flexible.svg?raw'
import mobileFriendlySvg from './assets/ux-mobile-friendly.svg?raw'
import responsiveSvg from './assets/ux-responsive.svg?raw'

const cards = [
	{
		svg: mobileFriendlySvg,
		title: 'Mobile Friendly',
		body: 'Optimized for touch interactions and mobile devices. POLAR provides smooth gestures, responsive controls, and efficient rendering on smartphones and tablets.',
	},
	{
		svg: responsiveSvg,
		title: 'Responsive',
		body: 'Seamlessly adapts to any screen size or device. From desktop monitors to mobile screens, POLAR delivers a consistent and optimized experience across all platforms.',
	},
	{
		svg: flexibleSvg,
		title: 'Flexible',
		body: 'Highly customizable and extensible architecture. Build custom plugins, integrate with existing systems, and configure POLAR to match your specific requirements.',
	},
	{
		svg: accessibleSvg,
		title: 'Accessible',
		body: 'Built with WCAG guidelines in mind. Keyboard navigation, screen reader support, and high contrast modes ensure your maps are accessible to all users.',
	},
]
</script>

<style scoped>
.lp-grid-4 {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
}

.lp-card {
	border-radius: var(--polar-radius);
	border: 1px solid #e2e8f0;
	background: #f7f7f9;
	overflow: hidden;
}

.lp-card__container {
	padding: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}

.lp-card__img {
	width: 100%;
	height: 96px;
	overflow: hidden;
	flex-shrink: 0;
	border-radius: var(--polar-radius, 8px) var(--polar-radius, 8px) 0 0;
	line-height: 0;
}

.lp-card__img svg {
	display: block;
	width: 100%;
	height: 96px;
}

.lp-card__title {
	font-size: 1.1rem;
	font-weight: 700;
	margin: 1.25rem 1.5rem 0.5rem;
}

.lp-card__body {
	font-size: 0.9rem;
	line-height: 1.6;
	margin: 0 1.5rem 1.5rem;
	color: var(--kern-color-text-muted, #6b7280);
}
</style>
