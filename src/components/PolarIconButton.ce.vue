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
		class="kern-btn kern-btn--primary polar-icon-button"
		@click="action"
		@mouseover="hoveredOrFocused = true"
		@mouseout="hoveredOrFocused = false"
		@focus="hoveredOrFocused = true"
		@blur="hoveredOrFocused = false"
	>
		<span class="kern-icon" :class="$props.icon" aria-hidden="true" />
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

// TODO(dopenguin): Implementation will need some updates when using with layout 'standard'

const props = defineProps<{
	action: () => void
	hint: string
	hintNamespace: string
	icon: string
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
	&:focus,
	&:hover {
		border: solid var(--kern-color-action-on-default) !important;
		outline: solid var(--kern-color-action-default);
	}
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
