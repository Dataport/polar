<!-- eslint-disable vue/enforce-style-attribute -->
<template>
	<div class="polar-icon-button-select">
		<PolarIconButton
			v-bind="iconButtonProps"
			:hint="iconButtonProps.hint ?? label"
		>
			<span
				class="kern-label"
				:class="{ 'polar-icon-button-label-active': iconButtonProps.active }"
			>
				{{ label }}
			</span>
			<PolarSelect
				v-if="selectProps"
				v-bind="selectProps"
				:label-sr-only="true"
				@click.stop
			/>
		</PolarIconButton>
	</div>
</template>

<script setup lang="ts">
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import PolarSelect from '@/components/PolarSelect.ce.vue'

type PolarIconButtonProps = InstanceType<typeof PolarIconButton>['$props']

defineProps<{
	iconButtonProps: Omit<PolarIconButtonProps, 'hint'> &
		Partial<Pick<PolarIconButtonProps, 'hint'>>
	selectProps?: InstanceType<typeof PolarSelect>['$props']
	label: string
}>()
</script>

<!-- Wrapping with .polar-icon-button-select to prevent side effects -->
<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
.polar-icon-button-select {
	width: 100%;

	.polar-tooltip-wrapper {
		width: 100%;

		.polar-icon-button {
			display: flex;
			justify-content: flex-start;
			width: 100%;

			.polar-icon-button-label-active {
				color: var(--kern-color-action-on-default);
				font-weight: var(--kern-typography-font-weight-semi-bold);
			}

			.polar-select {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				width: 50%;
			}
		}
	}
}
</style>
