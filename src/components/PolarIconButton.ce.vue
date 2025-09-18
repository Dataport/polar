<template>
	<div class="polar-icon-button-wrapper">
		<div class="polar-icon-button-anchor">
			<button
				ref="button"
				class="kern-btn kern-btn--secondary polar-icon-button"
				:disabled="disabled"
				:class="{ 'polar-icon-button-active': active }"
				@click="action"
			>
				<span
					class="kern-icon"
					:class="{
						[$props.icon]: true,
						'polar-icon-button-icon-active': active,
					}"
					aria-hidden="true"
				/>
				<span class="kern-label kern-sr-only">{{ hint }}</span>
			</button>
			<span
				v-if="$props.tooltipPosition && !hasSmallDisplay"
				class="polar-tooltip"
				:class="`polar-tooltip-${$props.tooltipPosition}`"
				aria-hidden="true"
			>
				{{ hint }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { t, type TOptions } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useCoreStore } from '@/core/stores/export.ts'

/*
 * TODO(dopenguin): Implementation will need some updates when using with layout 'standard'
 */

const props = defineProps<{
	action: () => void
	hint: string
	hintNamespace: string
	icon: string
	active?: boolean
	disabled?: boolean
	hintOptions?: TOptions
	tooltipPosition?: 'left' | 'right'
}>()

const hint = computed(
	() =>
		console.error(props) ||
		t(props.hint, { ns: props.hintNamespace, ...props.hintOptions })
)
const { hasSmallDisplay } = storeToRefs(useCoreStore())
</script>

<style scoped>
.polar-icon-button-anchor {
	display: flex;
	align-items: center;
	position: relative;

	.polar-icon-button {
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
	}

	.polar-tooltip {
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
		transition: opacity 250ms ease;
		opacity: 0;

		&.polar-tooltip-left {
			right: calc(100% + 0.5rem);
		}

		&.polar-tooltip-right {
			left: calc(100% + 0.5rem);
		}
	}

	&:hover .polar-tooltip,
	&:has(button:focus-visible) .polar-tooltip {
		opacity: 1;
	}
}
</style>
