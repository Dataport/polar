<template>
	<PolarTooltip :hint="hint" :tooltip-position="tooltipPosition">
		<button
			class="kern-btn kern-btn--secondary polar-icon-button"
			:class="{ 'polar-icon-button-active': active }"
			v-bind="$attrs"
		>
			<span
				class="kern-icon"
				:class="{ [icon]: true, 'polar-icon-button-icon-active': active }"
				aria-hidden="true"
			/>
			<span class="kern-label kern-sr-only">{{ hint }}</span>
		</button>
	</PolarTooltip>
</template>

<script setup lang="ts">
import PolarTooltip from './PolarTooltip.ce.vue'
defineProps<{
	hint: string
	icon: string
	active?: boolean
	tooltipPosition?: 'left' | 'right'
}>()

defineOptions({
	inheritAttrs: false,
})
</script>

<style scoped>
.polar-icon-button {
	position: relative;
	background: var(--kern-color-layout-background-default);
	box-shadow: var(--polar-shadow);
	border: none;

	&:focus,
	&:hover {
		background: var(--kern-color-layout-background-default);
		border: solid var(--kern-color-action-on-default);
		outline: solid var(--kern-color-action-default);
		outline-offset: 0;
	}

	.polar-icon-button-icon-active {
		background: var(--kern-color-layout-background-default);
	}
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
</style>
