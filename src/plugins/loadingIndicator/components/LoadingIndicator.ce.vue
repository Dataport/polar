<template>
	<div v-if="showLoader" class="polar-plugin-loading-indicator-wrapper">
		<div
			v-if="layout === 'standard'"
			class="polar-plugin-loading-indicator-overlay"
		/>
		<PolarCard>
			<div
				v-if="loaderStyle === 'kern-loader'"
				class="kern-loader kern-loader--visible"
				role="status"
			/>
			<component
				:is="customStyles[loaderStyle]"
				v-else
				class="kern-loader--visible"
				role="status"
			/>
		</PolarCard>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadingIndicatorStore } from '../store'
import {
	BasicLoader,
	CircleLoader,
	RingLoader,
	RollerLoader,
	SpinnerLoader,
} from './loaderStyles'
import PolarCard from '@/components/PolarCard.ce.vue'
import { useCoreStore } from '@/core/stores/export.ts'

const { layout } = storeToRefs(useCoreStore())
const { loaderStyle, showLoader } = storeToRefs(useLoadingIndicatorStore())
const customStyles = {
	BasicLoader,
	CircleLoader,
	RingLoader,
	RollerLoader,
	SpinnerLoader,
}
</script>

<style scoped>
.polar-plugin-loading-indicator-wrapper {
	z-index: 100;
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	.polar-plugin-loading-indicator-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: var(--kern-color-action-state-opacity-overlay);
		background: #fff;
	}

	.kern-card {
		min-width: fit-content;
		height: fit-content;
		border-radius: 50%;
	}

	:deep(.kern-card__container) {
		padding: var(--kern-metric-space-small) !important;
	}
}
</style>
