<template>
	<section class="lp-section lp-section--alt" aria-labelledby="roadmap-heading">
		<div class="lp-container">
			<div
				class="lp-section-header lp-section-header--left"
				style="margin-bottom: 2.5rem"
			>
				<span class="lp-pill lp-pill--pink" role="note">Our Roadmap</span>
				<h2 id="roadmap-heading" style="text-align: left">
					The Future of POLAR
				</h2>
				<p style="text-align: left; margin: 0">
					We're continuously improving POLAR. Here's what we've shipped and
					what's coming next.
				</p>
			</div>

			<div class="lp-timeline" role="list" aria-label="POLAR Roadmap">
				<div
					v-for="item in items"
					:key="item.title"
					:class="['lp-timeline-item', `lp-timeline-item--${item.status}`]"
					role="listitem"
				>
					<div class="lp-timeline-item__date">{{ item.date }}</div>
					<h3 class="lp-timeline-item__title">{{ item.title }}</h3>
					<p class="lp-timeline-item__body">{{ item.body }}</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
interface TimelineItem {
	body: string
	date: string
	status: 'done' | 'progress' | 'planned'
	title: string
}

const items: TimelineItem[] = [
	{
		status: 'done',
		date: 'Q4 2024',
		title: 'Core Framework Release',
		body: 'Initial release with OpenLayers integration, plugin system, and i18n support.',
	},
	{
		status: 'done',
		date: 'Q4 2024 – Q1 2025',
		title: 'Plugin Suite Expanded',
		body: 'Added address search, reverse geocoder, scale bar, fullscreen toggle, layer chooser, and toast notifications.',
	},
	{
		status: 'progress',
		date: 'Q1 2025 – ongoing',
		title: 'More Geostuff',
		body: 'Extended GeoJSON handling, cluster visualisation, and improved WMS/WFS layer management.',
	},
	{
		status: 'progress',
		date: 'In Progress',
		title: 'KERN Design System Integration',
		body: 'Full migration of all UI components to @kern-ux/native, ensuring a consistent public-sector look and feel.',
	},
	{
		status: 'planned',
		date: 'Planned',
		title: 'Enhanced UX & Theming',
		body: 'Dark mode support, theming API, and improved mobile interaction patterns.',
	},
	{
		status: 'planned',
		date: 'Planned',
		title: 'Something Wonderful',
		body: 'Stay tuned — we have exciting things in the works for the next major release.',
	},
]
</script>
