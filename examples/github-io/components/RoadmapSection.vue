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
								<RoadmapPhaseLabel
									v-if="ii === 0"
									:label="phase.label"
									:sublabel="phase.sublabel"
									:status="phase.status"
								/>
								<RoadmapCard
									v-else-if="ii % 2 !== 0"
									:title="item.title"
									:body="item.body"
									:accent-icon="item.accentIcon ?? phase.accentIcon"
									:status="phase.status"
									side="left"
								/>
							</div>

							<!-- Center marker: large milestone circle or small item pill -->
							<!-- kern-icon--check (milestone icon) — static scanning hint -->
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
								<RoadmapCard
									v-if="ii % 2 === 0"
									:title="item.title"
									:body="item.body"
									:accent-icon="item.accentIcon ?? phase.accentIcon"
									:status="phase.status"
									side="right"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import RoadmapCard from './RoadmapCard.vue'
import { phases } from './roadmapData'
import RoadmapPhaseLabel from './RoadmapPhaseLabel.vue'
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
