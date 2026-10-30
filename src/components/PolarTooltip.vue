<template>
	<div class="polar-tooltip-wrapper">
		<span
			v-if="tooltipPosition && !hasSmallDisplay"
			class="polar-tooltip"
			:class="`polar-tooltip-${tooltipPosition}`"
			aria-hidden="true"
		>
			{{ hint }}
		</span>
		<slot />
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useCoreStore } from '@/core/stores'

defineProps<{
	hint: string
	tooltipPosition?: 'left' | 'right'
}>()
const { hasSmallDisplay } = storeToRefs(useCoreStore())
</script>

<style scoped>
.polar-tooltip-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

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
	&:focus-within .polar-tooltip {
		opacity: 1;
	}
}
</style>
