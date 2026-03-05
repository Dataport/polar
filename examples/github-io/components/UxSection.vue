<template>
	<section class="lp-section" aria-labelledby="ux-heading">
		<div class="lp-container">
			<div class="lp-section-header">
				<span class="kern-badge kern-badge--pink" role="note">
					<span class="kern-label">User Experience</span>
				</span>
				<h2 id="ux-heading">Built for humans, by humans who care!</h2>
				<p>
					POLAR is designed with user experience at its core &mdash; responsive,
					accessible, and intuitive regardless of the device or context.
				</p>
			</div>

			<div class="lp-grid-4">
				<article
					v-for="card in cards"
					:key="card.title"
					class="kern-card lp-card"
					style="text-align: center"
				>
					<div
						class="kern-card__container"
						style="
							padding: 2rem 1.5rem;
							align-items: center;
							display: flex;
							flex-direction: column;
						"
					>
						<div
							class="lp-card__icon-wrap"
							:style="{ background: card.iconBg }"
						>
							<span
								:class="['kern-icon', card.icon]"
								:style="{ backgroundColor: card.iconColor }"
							></span>
						</div>
						<h3 class="lp-card__title">{{ card.title }}</h3>
						<p class="lp-card__body">{{ card.body }}</p>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const cards = [
	{
		icon: 'kern-icon--draft',
		iconBg: '#dbeafe',
		iconColor: '#1d4ed8',
		title: 'Mobile Friendly',
		body: 'Optimized for touch interactions and mobile devices. POLAR provides smooth gestures, responsive controls, and efficient rendering on smartphones and tablets.',
	},
	{
		icon: 'kern-icon--arrow-forward',
		iconBg: '#dcfce7',
		iconColor: '#15803d',
		title: 'Responsive',
		body: 'Seamlessly adapts to any screen size or device. From desktop monitors to mobile screens, POLAR delivers a consistent and optimized experience across all platforms.',
	},
	{
		icon: 'kern-icon--edit',
		iconBg: '#fef3c7',
		iconColor: '#d97706',
		title: 'Flexible',
		body: 'Highly customizable and extensible architecture. Build custom plugins, integrate with existing systems, and configure POLAR to match your specific requirements.',
	},
	{
		icon: 'kern-icon--help',
		iconBg: '#fae8ff',
		iconColor: '#9333ea',
		title: 'Accessible',
		body: 'Built with WCAG guidelines in mind. Keyboard navigation, screen reader support, and high contrast modes ensure your maps are accessible to all users.',
	},
]
</script>
