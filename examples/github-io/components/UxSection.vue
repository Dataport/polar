<template>
	<section class="lp-section">
		<div class="lp-container">
			<div class="lp-section-header">
				<TheBadge color="pink">User Experience</TheBadge>
				<h3>Built for humans, by humans who care!</h3>
				<p>
					POLAR is designed with user experience at its core, ensuring your
					mapping applications are accessible, responsive, and delightful to
					use.
				</p>
			</div>
			<div class="kern-container">
				<div class="kern-row">
					<div
						v-for="card in cards"
						:key="card.title"
						class="kern-col-xl-3 kern-col-sm-6"
					>
						<article class="kern-card lp-card">
							<div class="kern-card__media" aria-hidden="true">
								<img :src="card.svg" alt="" />
							</div>
							<div class="kern-card__container">
								<header class="kern-card__header">
									<h4 class="kern-title">{{ card.title }}</h4>
								</header>
								<section class="kern-card__body">
									<p class="kern-body">{{ card.body }}</p>
								</section>
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import accessibleSvg from './assets/ux-accessible.svg'
import flexibleSvg from './assets/ux-flexible.svg'
import mobileFriendlySvg from './assets/ux-mobile-friendly.svg'
import responsiveSvg from './assets/ux-responsive.svg'
import TheBadge from './TheBadge.vue'

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
.kern-card {
	background: var(--kern-color-layout-background-hued);
	border: none;
	border-radius: var(--kern-metric-border-radius-large, 0.5rem);

	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);
}
</style>
