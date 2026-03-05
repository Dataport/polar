<template>
	<section class="lp-section" aria-labelledby="features-heading">
		<div class="lp-container">
			<div class="lp-section-header">
				<span class="kern-badge kern-badge--info" role="note">
					<span class="kern-icon kern-icon--info"></span>
					<span class="kern-label">Features</span>
				</span>
				<h2 id="features-heading">Everything you need for modern mapping</h2>
				<p>
					POLAR combines cutting-edge technology with ease of use &mdash; giving
					developers a configurable, accessible, and production-ready map client
					out of the box.
				</p>
			</div>

			<div class="lp-grid-3">
				<article
					v-for="feature in features"
					:key="feature.title"
					class="kern-card lp-card"
				>
					<div class="kern-card__container" style="padding: 1.5rem">
						<div class="lp-card__icon-wrap">
							<span
								:class="['kern-icon', feature.icon]"
								style="background-color: var(--polar-blue)"
							></span>
						</div>
						<h3 class="lp-card__title">{{ feature.title }}</h3>
						<p class="lp-card__body">{{ feature.body }}</p>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const features = [
	{
		icon: 'kern-icon--autorenew',
		title: 'Regular Updates',
		body: 'Continuously maintained and improved, with new plugins and features shipped on a regular cadence.',
	},
	{
		icon: 'kern-icon--add',
		title: 'Plugin Architecture',
		body: 'Compose feature-rich maps from reusable, independently configurable plugins — from layer choosers to geocoders.',
	},
	{
		icon: 'kern-icon--checklist',
		title: 'Accessibility First',
		body: 'WCAG-compliant by design. ARIA support, keyboard navigation, and screen-reader-friendly structure built in from day one.',
	},
	{
		icon: 'kern-icon--visibility',
		title: 'OpenLayers Based',
		body: 'Built on the battle-tested OpenLayers mapping library, giving you access to WMS, WFS, vector tiles, and more.',
	},
	{
		icon: 'kern-icon--brightness-medium',
		title: 'KERN Design System',
		body: 'Styled consistently with KERN UX — the official design system for public-sector digital services in northern Germany.',
	},
	{
		icon: 'kern-icon--open-in-new',
		title: 'Open Source (EUPL)',
		body: 'Licensed under the European Union Public Licence. Free to use, fork, and contribute — built in the open, for the public.',
	},
]
</script>
