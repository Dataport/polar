<template>
	<button
		class="kern-btn kern-btn--secondary polar-icon-button"
		:class="{ 'polar-icon-button-active': active }"
		@click="action"
	>
		<span
			class="kern-icon"
			:class="{ [icon]: true, 'polar-icon-button-icon-active': active }"
			aria-hidden="true"
		/>
		<span class="kern-label kern-sr-only">
			{{ t(hint, { ns: hintNamespace, ...hintOptions }) }}
		</span>
		<span
			v-if="tooltipPosition && !hasSmallDisplay"
			class="polar-tooltip"
			:class="`polar-tooltip-${tooltipPosition}`"
			aria-hidden="true"
		>
			{{ t(hint, { ns: hintNamespace, ...hintOptions }) }}
		</span>
	</button>
</template>

<script setup lang="ts">
import { t, type TOptions } from 'i18next'
import { storeToRefs } from 'pinia'
import { useCoreStore } from '@/core/stores/export'

defineProps<{
	action: () => void
	hint: string
	hintNamespace: string
	icon: string
	active?: boolean
	hintOptions?: TOptions
	tooltipPosition?: 'left' | 'right'
}>()
const { hasSmallDisplay } = storeToRefs(useCoreStore())
</script>

<style scoped>
.polar-icon-button {
	position: relative;
	background: var(--kern-color-layout-background-default);
	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);
	border: none;

	&:focus,
	&:hover {
		background: var(--kern-color-layout-background-default);
		border: solid var(--kern-color-action-on-default);
		outline: solid var(--kern-color-action-default);
	}

	.polar-icon-button-active {
		background: var(--kern-color-action-default);

		&:focus,
		&:hover {
			background: var(--kern-color-action-default);
			border: solid var(--kern-color-action-on-default);
			outline: solid var(--kern-color-action-default);
		}
	}

	.polar-icon-button-icon-active {
		background: var(--kern-color-layout-background-default);
	}

	.polar-tooltip {
		z-index: 42;
		position: absolute;
		padding: 5px 16px;
		font-family: sans-serif;
		background: #616161e6;
		color: #fff;
		border: 2px solid #fff;
		border-radius: 4px;
		font-size: 14px;
		line-height: 22px;
		white-space: nowrap;
		pointer-events: none;
		transition-property: opacity, right, left;
		transition-duration: 250ms;
		transition-timing-function: ease;
		opacity: 0;

		&.polar-tooltip-left {
			right: calc(100% + 0.75rem);
		}
		&.polar-tooltip-right {
			left: calc(100% + 0.75rem);
		}
	}

	&:hover .polar-tooltip,
	&:focus-visible .polar-tooltip {
		opacity: 1;
	}
}
</style>
