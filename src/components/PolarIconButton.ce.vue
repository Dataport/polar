<template>
	<span
		v-if="$props.tooltipPosition === 'left' && !hasSmallDisplay"
		class="polar-tooltip"
		:style="`opacity: ${hoveredOrFocused ? '1' : '0'}; ${position}`"
		aria-hidden="true"
	>
		{{ hint }}
	</span>
	<button
		ref="button"
		class="kern-btn kern-btn--secondary polar-icon-button"
		:class="{ 'polar-icon-button-active': active }"
		@click="action"
		@mouseover="hoveredOrFocused = true"
		@mouseout="hoveredOrFocused = false"
		@focus="hoveredOrFocused = true"
		@blur="hoveredOrFocused = false"
	>
		<span
			class="kern-icon"
			:class="{ [$props.icon]: true, 'polar-icon-button-icon-active': active }"
			aria-hidden="true"
		/>
		<span class="kern-label kern-sr-only">{{ hint }}</span>
	</button>
	<span
		v-if="$props.tooltipPosition === 'right' && !hasSmallDisplay"
		class="polar-tooltip"
		:style="`opacity: ${hoveredOrFocused ? '1' : '0'}; ${position}`"
		aria-hidden="true"
	>
		{{ hint }}
	</span>
</template>

<script setup lang="ts">
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
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
	tooltipPosition?: 'left' | 'right'
}>()

const hoveredOrFocused = ref(false)
const position = ref('')

const hint = computed(() => t(props.hint, { ns: props.hintNamespace }))
const { hasSmallDisplay } = storeToRefs(useCoreStore())

const button = useTemplateRef<HTMLButtonElement>('button')
onMounted(() => {
	// @ts-expect-error | The button is defined after the component has been mounted.
	position.value = `${props.tooltipPosition === 'right' ? 'left' : 'right'}: ${button.value.offsetWidth + 16}px;`
})
</script>

<style scoped>
.polar-icon-button {
	background: var(--kern-color-layout-background-default);
	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);
	border: none;

	&:focus,
	&:hover {
		background: var(--kern-color-layout-background-default) !important;
		border: solid var(--kern-color-action-on-default);
		outline: solid var(--kern-color-action-default);
	}
}

.polar-icon-button-active {
	background: var(--kern-color-action-default) !important;

	&:focus,
	&:hover {
		background: var(--kern-color-action-default) !important;
		border: solid var(--kern-color-action-on-default);
		outline: solid var(--kern-color-action-default);
	}
}

.polar-icon-button-icon-active {
	background: var(--kern-color-layout-background-default) !important;
}

.polar-tooltip {
	display: inline-block;
	position: absolute;
	width: auto;
	margin-top: 8px;
	padding: 5px 16px;
	font-family: sans-serif;
	background: #616161e6;
	color: #fff;
	border: 2px solid #fff;
	border-radius: 4px;
	font-size: 14px;
	line-height: 22px;
	white-space: nowrap;
	text-transform: none;
	pointer-events: none;
	transition: opacity 250ms ease;
}
</style>
