<template>
	<!-- Icon names used dynamically below — listed here for kern-extra-icons static scanning: -->
	<!-- kern-icon--check kern-icon--location-on kern-icon--palette kern-icon--rocket-launch -->
	<div
		:class="[
			'lp-roadmap__card',
			`lp-roadmap__card--${side}`,
			`lp-roadmap__card--${status}`,
		]"
	>
		<div
			v-if="side === 'right'"
			:class="['lp-roadmap__card-accent', `lp-roadmap__card-accent--${status}`]"
		>
			<span
				:class="['kern-icon', `kern-icon--${accentIcon}`]"
				aria-hidden="true"
			/>
		</div>

		<div class="lp-roadmap__card-content">
			<p class="lp-roadmap__card-title">{{ title }}</p>
			<p class="lp-roadmap__card-body">{{ body }}</p>
		</div>

		<div
			v-if="side === 'left'"
			:class="['lp-roadmap__card-accent', `lp-roadmap__card-accent--${status}`]"
		>
			<span
				:class="['kern-icon', `kern-icon--${accentIcon}`]"
				aria-hidden="true"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PhaseStatus } from './roadmapData'

defineProps<{
	title: string
	body: string
	accentIcon: string
	status: PhaseStatus
	side: 'left' | 'right'
}>()
</script>

<style scoped>
/* ── Card shell ────────────────────────────────────────── */
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
	box-shadow: 0 2px 8px -2px
		color-mix(in srgb, var(--polar-blue-300) 50%, transparent);
}

.lp-roadmap__card-accent--progress {
	background: linear-gradient(
		to bottom,
		var(--polar-green-500),
		var(--polar-green-600)
	);
	box-shadow: 0 2px 8px -2px
		color-mix(in srgb, var(--polar-green-300) 50%, transparent);
}

.lp-roadmap__card-accent--planned {
	background: linear-gradient(
		to bottom,
		var(--polar-grey-500),
		var(--polar-grey-600)
	);
	box-shadow: 0 2px 8px -2px
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

.lp-roadmap__card--planned .lp-roadmap__card-title,
.lp-roadmap__card--planned .lp-roadmap__card-body {
	color: var(--polar-text-default);
}

.lp-roadmap__card--left .lp-roadmap__card-content {
	text-align: right;
}
</style>
