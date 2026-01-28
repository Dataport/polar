<template>
	<div
		class="polar-plugin-scale"
		:class="
			layout === 'nineRegions'
				? `polar-plugin-scale-nineRegions ${layoutTag}`
				: ''
		"
		:title="$t(($) => $.label, { ns: PluginId })"
		:aria-label="$t(($) => $.label, { ns: PluginId })"
	>
		<PolarSelect
			v-if="showScaleSwitcher"
			:value="zoomValue"
			:options="zoomOptions"
			:aria-label="$t(($) => $.scaleSwitcher, { ns: PluginId })"
			small
			@update:value="setZoom"
		/>
		<span v-else class="scale-as-a-ratio">
			{{ scaleToOne }}
		</span>
		<span class="scale-line">
			<span class="scale-line-text">{{ scaleWithUnit }}</span>
			<span class="scale-line-scale" />
		</span>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarSelect from '@/components/PolarSelect.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useScaleStore } from '../store'
import { PluginId } from '../types'

const scaleStore = useScaleStore()
const coreStore = useCoreStore()

const { layoutTag, scaleToOne, scaleWithUnit, showScaleSwitcher, zoomOptions } =
	storeToRefs(scaleStore)

const { layout, zoom } = storeToRefs(coreStore)

const zoomValue = computed(() => `${Math.round(zoom.value)}`)

function setZoom(value) {
	zoom.value = Number(value)
}
</script>

<style scoped>
.polar-plugin-scale {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: var(--kern-metric-space-small);
	padding: 0 var(--kern-metric-space-small);

	.scale-as-a-ratio {
		white-space: nowrap;
		color: var(--kern-color-layout-text-default);
	}

	.scale-line-text {
		font-weight: bolder;
		color: var(--kern-color-layout-text-default);
		min-width: 5ch;
		text-align: right;
	}

	.scale-line {
		display: flex;
		align-items: anchor-center;
		gap: var(--kern-metric-space-small);

		.scale-line-scale {
			border-radius: 0 0 0.125rem 0.125rem;
			border-right: 1px solid var(--kern-color-form-input-border);
			border-bottom: 1px solid var(--kern-color-form-input-border);
			border-left: 1px solid var(--kern-color-form-input-border);

			height: 0.75rem;
			width: 2cm;
		}
	}

	:deep(.kern-form-input__select-wrapper) {
		background-color: var(--kern-color-form-input-background-inverted);
	}

	&.polar-plugin-scale-nineRegions {
		gap: var(--kern-metric-space-2x-small);
		padding: var(--kern-metric-space-2x-small);
		align-items: stretch;

		> * {
			background: var(--kern-color-form-input-background-inverted);
			border-radius: var(--kern-metric-border-radius-large);
			padding: var(--kern-metric-space-x-small) var(--kern-metric-space-small);
			box-shadow: var(--polar-shadow);
		}

		.scale-line-text {
			text-align: left;
		}

		/** 1:x may change width, push to inner side to avoid wobbly repositioning of scale line */
		&.BOTTOM_LEFT,
		&.TOP_LEFT,
		&.MIDDLE_LEFT {
			flex-direction: row-reverse;
		}
	}
}
</style>
