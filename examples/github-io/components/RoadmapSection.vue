<template>
	<section class="lp-roadmap-section" aria-labelledby="roadmap-heading">
		<div class="lp-roadmap-section__header">
			<div class="lp-container">
				<div class="lp-section-header lp-section-header--center">
					<span class="lp-pill lp-pill--pink" role="note">Our Roadmap</span>
					<h2 id="roadmap-heading" style="text-align: center">
						The Future of POLAR
					</h2>
					<p style="text-align: center">
						We're continuously improving POLAR. Here's what we've shipped and
						what's coming next.
					</p>
				</div>
			</div>
		</div>

		<div class="lp-roadmap-section__body">
			<div class="lp-container">
				<div class="lp-roadmap" role="list" aria-label="POLAR Roadmap">
					<div
						v-for="phase in phases"
						:key="phase.status"
						:class="['lp-roadmap__phase', `lp-roadmap__phase--${phase.status}`]"
					>
						<div
							v-for="(item, ii) in phase.items"
							:key="item.title"
							:class="[
								'lp-roadmap__row',
								ii % 2 === 0
									? 'lp-roadmap__row--right'
									: 'lp-roadmap__row--left',
							]"
							role="listitem"
						>
							<!-- Left cell: phase label (milestone rows) OR left-side card -->
							<div class="lp-roadmap__cell lp-roadmap__cell--left">
								<div
									v-if="ii === 0"
									:class="[
										'lp-roadmap__phase-label',
										`lp-roadmap__phase-label--${phase.status}`,
									]"
								>
									<span class="lp-roadmap__phase-sublabel">{{
										phase.sublabel
									}}</span>
									<span class="lp-roadmap__phase-date">{{ phase.label }}</span>
								</div>
								<div
									v-else-if="ii % 2 !== 0"
									:class="[
										'lp-roadmap__card',
										'lp-roadmap__card--left',
										`lp-roadmap__card--${phase.status}`,
									]"
								>
									<div class="lp-roadmap__card-content">
										<p class="lp-roadmap__card-title">{{ item.title }}</p>
										<p class="lp-roadmap__card-body">{{ item.body }}</p>
									</div>
									<div
										:class="[
											'lp-roadmap__card-accent',
											`lp-roadmap__card-accent--${phase.status}`,
										]"
									>
										<span
											:class="[
												'kern-icon',
												`kern-icon--${item.accentIcon ?? phase.accentIcon}`,
											]"
											aria-hidden="true"
										/>
									</div>
								</div>
							</div>

							<!-- Center marker: large milestone circle or small item pill -->
							<div class="lp-roadmap__center" aria-hidden="true">
								<div
									v-if="ii === 0"
									:class="[
										'lp-roadmap__milestone',
										`lp-roadmap__milestone--${phase.status}`,
									]"
								>
									<span
										v-if="phase.milestoneIcon"
										:class="['kern-icon', `kern-icon--${phase.milestoneIcon}`]"
										aria-hidden="true"
									/>
								</div>
								<div
									v-else
									:class="[
										'lp-roadmap__dot',
										`lp-roadmap__dot--${phase.status}`,
									]"
								/>
							</div>

							<!-- Right cell: right-side card (milestone + even sub-items) -->
							<div class="lp-roadmap__cell lp-roadmap__cell--right">
								<div
									v-if="ii % 2 === 0"
									:class="[
										'lp-roadmap__card',
										'lp-roadmap__card--right',
										`lp-roadmap__card--${phase.status}`,
									]"
								>
									<div
										:class="[
											'lp-roadmap__card-accent',
											`lp-roadmap__card-accent--${phase.status}`,
										]"
									>
										<span
											:class="[
												'kern-icon',
												`kern-icon--${item.accentIcon ?? phase.accentIcon}`,
											]"
											aria-hidden="true"
										/>
									</div>
									<div class="lp-roadmap__card-content">
										<p class="lp-roadmap__card-title">{{ item.title }}</p>
										<p class="lp-roadmap__card-body">{{ item.body }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
// Icon names used dynamically below — listed here for vite-plugin-kern-extra-icons static scanning:
// kern-icon--check kern-icon--location-on kern-icon--palette kern-icon--rocket-launch
interface RoadmapItem {
	body: string
	title: string
	accentIcon?: string
}

interface Phase {
	accentIcon: string
	items: RoadmapItem[]
	label: string
	milestoneIcon: string
	status: 'done' | 'progress' | 'planned'
	sublabel: string
}

const phases: Phase[] = [
	{
		status: 'done',
		label: 'Q4·2024',
		sublabel: 'Completed',
		accentIcon: 'check',
		milestoneIcon: 'check',
		items: [
			{
				title: 'Core Framework Release',
				body: 'Initial release with OpenLayers integration, plugin system, and i18n support.',
			},
			{
				title: 'Plugin Suite Expanded',
				body: 'Added address search, reverse geocoder, scale bar, fullscreen toggle, layer chooser, and toast notifications.',
			},
		],
	},
	{
		status: 'progress',
		label: 'Q1·2025',
		sublabel: 'In Progress',
		accentIcon: 'location-on',
		milestoneIcon: '',
		items: [
			{
				title: 'More Geostuff',
				body: 'Extended GeoJSON handling, cluster visualisation, and improved WMS/WFS layer management.',
			},
			{
				title: 'KERN Design System Integration',
				body: 'Full migration of all UI components to @kern-ux/native, ensuring a consistent public-sector look and feel.',
			},
			{
				title: 'Added Monument Icon Package',
				body: 'Integrated the monument icon set, expanding the icon library for cultural heritage use cases.',
			},
			{
				title: 'Fixed some bugs',
				body: 'Various stability improvements and regression fixes across the plugin ecosystem.',
				accentIcon: 'check',
			},
		],
	},
	{
		status: 'planned',
		label: 'Q4·2025',
		sublabel: 'Planned',
		accentIcon: 'palette',
		milestoneIcon: '',
		items: [
			{
				title: 'Enhanced UX & Theming',
				body: 'Dark mode support, theming API, and improved mobile interaction patterns.',
				accentIcon: 'palette',
			},
			{
				title: 'Something Wonderful',
				body: 'Stay tuned — we have exciting things in the works for the next major release.',
				accentIcon: 'rocket-launch',
			},
		],
	},
]
</script>

<style scoped>
/* ── Two-band section layout ───────────────────────────── */
.lp-roadmap-section {
	display: flex;
	flex-direction: column;
}

.lp-roadmap-section__header {
	background: #fff;
	padding: 5rem 0 2.5rem;
}

.lp-roadmap-section__body {
	background: #f7f7f9;
	padding: 2.5rem 0 5rem;
}

/* ── Phase section: draws the phase-coloured vertical line */
.lp-roadmap__phase {
	position: relative;
	display: flow-root;
}

.lp-roadmap__phase::before {
	content: '';
	position: absolute;
	left: 50%;
	top: 0;
	bottom: 0;
	width: 3px;
	transform: translateX(-50%);
	z-index: 0;
	border-radius: 2px;
}

.lp-roadmap__phase--done::before {
	background: linear-gradient(
		to bottom,
		var(--polar-blue-500),
		var(--polar-blue-600)
	);
}

.lp-roadmap__phase--progress::before {
	background: linear-gradient(
		to bottom,
		var(--polar-green-300),
		var(--polar-green-500)
	);
}

.lp-roadmap__phase--planned::before {
	background: var(--polar-grey-300);
}

/* ── Phase connectors (gradient line between phases) ────── */
.lp-roadmap__phase--done::after,
.lp-roadmap__phase--progress::after {
	content: '';
	position: absolute;
	left: 50%;
	width: 3px;
	height: 3rem;
	bottom: -1.5rem;
	transform: translateX(-50%);
	z-index: 1;
}

.lp-roadmap__phase--done::after {
	background: linear-gradient(
		to bottom,
		var(--polar-blue-600),
		var(--polar-green-300)
	);
}

.lp-roadmap__phase--progress::after {
	background: linear-gradient(
		to bottom,
		var(--polar-green-500),
		var(--polar-grey-300)
	);
}

/* ── Row: 3-column grid (left | center | right) ────────── */
.lp-roadmap__row {
	display: grid;
	grid-template-columns: 1fr 4rem 1fr;
	align-items: center;
	margin-bottom: 1.5rem;
}

.lp-roadmap__cell {
	padding: 0 0.875rem;
}

/* ── Center column wrapper ─────────────────────────────── */
.lp-roadmap__center {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	z-index: 1;
}

/* ── Milestone circle (large, per-phase marker) ────────── */
.lp-roadmap__milestone {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	border: 4px solid #fff;
	box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.07);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	position: relative;
	z-index: 2;
}

.lp-roadmap__milestone .kern-icon {
	width: 24px;
	height: 24px;
	background-color: #fff;
}

.lp-roadmap__milestone--done {
	background: var(--polar-blue-500);
}

.lp-roadmap__milestone--progress {
	background: var(--polar-green-300);
}

.lp-roadmap__milestone--progress::before {
	content: '';
	display: block;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: 2.5px solid rgba(255, 255, 255, 0.9);
	background: transparent;
	z-index: 3;
}

.lp-roadmap__milestone--progress::after {
	content: '';
	position: absolute;
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.9);
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 4;
}

/* Planned: white circle with gray ring */
.lp-roadmap__milestone--planned {
	background: #fff;
	border-color: #dfe1ea;
	box-shadow: inset 0 0 0 2px #dfe1ea;
}

/* ── Item dot (pill-shaped, per-item marker) ───────────── */
.lp-roadmap__dot {
	width: 24px;
	height: 32px;
	border-radius: 12px;
	border: 3px solid #fff;
	box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 2;
	flex-shrink: 0;
}

.lp-roadmap__dot--done {
	background: var(--polar-blue-500);
}

.lp-roadmap__dot--progress {
	background: var(--polar-green-500);
}

.lp-roadmap__dot--planned {
	background: #dfe1ea;
}

/* ── Cards ─────────────────────────────────────────────── */
.lp-roadmap__card {
	display: flex;
	align-items: center;
	gap: 0.875rem;
	padding: 0.875rem;
	background: #fff;
	border-radius: 16px;
	box-shadow:
		0px 1px 2px rgba(23, 26, 43, 0.04),
		0px 4px 8px rgba(23, 26, 43, 0.06),
		0px 10px 20px rgba(23, 26, 43, 0.06),
		0px 20px 32px rgba(23, 26, 43, 0.04);
	min-height: 80px;
}

/* ── Card accent bar (on the inner/center-facing side) ──── */
.lp-roadmap__card-accent {
	width: 52px;
	height: 76px;
	min-width: 52px;
	border-radius: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.lp-roadmap__card-accent .kern-icon {
	width: 32px;
	height: 32px;
	background-color: #fff;
}

.lp-roadmap__card-accent--done {
	background: linear-gradient(
		to bottom,
		var(--polar-blue-500),
		var(--polar-blue-600)
	);
	box-shadow: 0 4px 12px
		color-mix(in srgb, var(--polar-blue-300) 50%, transparent);
}

.lp-roadmap__card-accent--progress {
	background: linear-gradient(
		to bottom,
		var(--polar-green-500),
		var(--polar-green-600)
	);
	box-shadow: 0 4px 12px
		color-mix(in srgb, var(--polar-green-300) 50%, transparent);
}

.lp-roadmap__card-accent--planned {
	background: linear-gradient(
		to bottom,
		var(--polar-grey-500),
		var(--polar-grey-600)
	);
	box-shadow: 0 4px 12px
		color-mix(in srgb, var(--polar-grey-300) 50%, transparent);
}

.lp-roadmap__card-accent--planned .kern-icon {
	background-color: #fff;
}

/* ── Card content ──────────────────────────────────────── */
.lp-roadmap__card-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-width: 0;
}

.lp-roadmap__card-title {
	font-size: 0.9375rem;
	font-weight: 600;
	color: var(--polar-text-default);
	margin: 0 0 0.25rem;
	line-height: 1.3;
}

.lp-roadmap__card-body {
	font-size: 0.8125rem;
	color: #4a5068;
	margin: 0;
	line-height: 1.5;
}

.lp-roadmap__card--planned .lp-roadmap__card-title {
	color: var(--polar-text-default);
}

.lp-roadmap__card--planned .lp-roadmap__card-body {
	color: var(--polar-text-default);
}

.lp-roadmap__card--left .lp-roadmap__card-content {
	text-align: right;
}

/* ── Phase date label (in left cell of milestone rows) ──── */
.lp-roadmap__phase-label {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: fit-content;
	gap: 0.5rem;
	padding: 0.375rem 1.375rem 0.375rem 0.75rem;
	margin-left: auto;
	margin-right: -1.375rem;
	border-radius: 100px;
}

.lp-roadmap__phase-date {
	font-size: 0.8125rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	line-height: 1.5;
}

.lp-roadmap__phase-sublabel {
	display: inline-block;
	padding: 0.175rem 0.625rem;
	border-radius: 100px;
	font-size: 0.75rem;
	font-weight: 600;
}

.lp-roadmap__phase-label--done {
	background: #bee7ff;
}

.lp-roadmap__phase-label--done .lp-roadmap__phase-date {
	color: #004e8c;
}

.lp-roadmap__phase-label--done .lp-roadmap__phase-sublabel {
	background: #e3f4ff;
	color: #0066b8;
}

.lp-roadmap__phase-label--progress {
	background: #47ffb0;
}

.lp-roadmap__phase-label--progress .lp-roadmap__phase-date {
	color: #004d33;
}

.lp-roadmap__phase-label--progress .lp-roadmap__phase-sublabel {
	background: #c6ffe8;
	color: #00543c;
}

.lp-roadmap__phase-label--planned {
	background: #dfe1ea;
}

.lp-roadmap__phase-label--planned .lp-roadmap__phase-date {
	color: var(--polar-text-default);
}

.lp-roadmap__phase-label--planned .lp-roadmap__phase-sublabel {
	background: #eff0f5;
	color: var(--polar-text-default);
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 640px) {
	.lp-roadmap__phase::before {
		left: 1.25rem;
		transform: none;
	}

	.lp-roadmap__row {
		grid-template-columns: 2.5rem 1fr;
	}

	.lp-roadmap__center {
		grid-column: 1;
		grid-row: 1;
	}

	/* RIGHT rows: hide left cell (phase label), show right card in col 2 */
	.lp-roadmap__row--right .lp-roadmap__cell--left {
		display: none;
	}

	.lp-roadmap__row--right .lp-roadmap__cell--right {
		grid-column: 2;
		grid-row: 1;
		padding-left: 0.75rem;
		padding-right: 0;
	}

	/* LEFT rows: show left card in col 2, hide empty right cell */
	.lp-roadmap__row--left .lp-roadmap__cell--left {
		grid-column: 2;
		grid-row: 1;
		padding-left: 0.75rem;
		padding-right: 0;
	}

	.lp-roadmap__row--left .lp-roadmap__cell--right {
		display: none;
	}
}
</style>
