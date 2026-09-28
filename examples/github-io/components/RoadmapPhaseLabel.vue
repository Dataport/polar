<template>
	<div
		:class="['lp-roadmap__phase-label', `lp-roadmap__phase-label--${status}`]"
	>
		<span class="lp-roadmap__phase-sublabel">{{ sublabel }}</span>
		<span class="lp-roadmap__phase-date">{{ label }}</span>
	</div>
</template>

<script setup lang="ts">
import type { PhaseStatus } from './roadmapData'

defineProps<{
	label: string
	sublabel: string
	status: PhaseStatus
}>()
</script>

<style scoped>
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
</style>
