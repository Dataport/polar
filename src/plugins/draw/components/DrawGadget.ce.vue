<template>
	<PolarCard class="polar-draw-gadget">
		<h2 class="kern-heading-medium">
			{{ $t(($) => $.label, { ns: PluginId }) }}
		</h2>

		<!-- TODO: show invisible layers as disabled -->
		<PolarSelect
			v-if="layerOptions.length > 1"
			v-model="activeLayerId"
			:label="$t(($) => $.layerSelection.label, { ns: PluginId })"
			label-sr-only
			:options="layerOptions"
		/>

		<template v-for="(button, index) in buttons" :key="index">
			<PolarIconButtonSelect
				class="draw-gadget-button"
				:icon-button-props="button.iconButtonProps"
				:select-props="button.selectProps"
				:label="button.label"
			/>

			<DrawHelp v-if="button.iconButtonProps.active" :mode="button.label" />

			<DrawText v-if="button.iconButtonProps.active" />

			<DrawMeasure v-if="button.iconButtonProps.active" />

			<!-- separates activatable tools from one-time effects -->
			<hr v-if="index === 2" class="kern-divider" aria-hidden="true" />
		</template>
	</PolarCard>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { DrawMode, EditMode, ToolMode } from '../types'

import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'
import PolarIconButtonSelect from '@/components/PolarIconButtonSelect.ce.vue'
import PolarSelect from '@/components/PolarSelect.ce.vue'

import { useDrawStore } from '../store'
import { DrawModes, EditModes, PluginId } from '../types'
import {
	deleteIcon,
	downloadIcon,
	drawModeIcon,
	editModeIcon,
	uploadIcon,
} from '../utils/icons'
import DrawHelp from './DrawHelp.ce.vue'
import DrawMeasure from './DrawMeasure.ce.vue'
import DrawText from './DrawText.ce.vue'

const drawStore = useDrawStore()
const {
	activeTool,
	drawMode,
	drawOptions,
	editMode,
	layerOptions,
	activeLayerId,
} = storeToRefs(drawStore)

function onButtonClick(tool: ToolMode) {
	if (activeTool.value === tool) {
		// interpret re-click on active tool as "deactivate tool"
		activeTool.value = null
	} else {
		activeTool.value = tool
	}
}

function createModeUpdater<T extends string>(target: Ref<T>) {
	return (value: string) => {
		// interpret re-selecting same option as "no change"
		if (target.value === value) {
			return
		}
		target.value = value as T
	}
}

const onDrawModeUpdate = createModeUpdater<DrawMode>(drawMode)
const onEditModeUpdate = createModeUpdater<EditMode>(editMode)

const buttons = computed(() =>
	[
		{
			label: t(($) => $.drawMode.label, { ns: PluginId }),
			iconButtonProps: {
				icon: drawModeIcon(drawMode.value),
				active: activeTool.value === 'draw',
				onClick: () => {
					onButtonClick('draw')
				},
			},
			selectProps: {
				modelValue: drawMode.value,
				'onUpdate:modelValue': onDrawModeUpdate,
				options: DrawModes.map((mode) => ({
					value: mode,
					label: t(($) => $.drawMode[mode], { ns: PluginId }),
				})).filter(({ value }) => drawOptions.value.includes(value)),
			},
		},
		{
			label: t(($) => $.editMode.label, { ns: PluginId }),
			iconButtonProps: {
				icon: editModeIcon(editMode.value),
				active: activeTool.value === 'edit',
				onClick: () => {
					onButtonClick('edit')
				},
			},
			selectProps: {
				modelValue: editMode.value,
				'onUpdate:modelValue': onEditModeUpdate,

				/*
				 * TODO: Only provide cut/merge if Polygon is available.
				 * TODO: Only provide lasso if something is configured for lasso.
				 */
				options: EditModes.map((mode) => ({
					value: mode,
					label: t(($) => $.editMode[mode], { ns: PluginId }),
				})),
			},
		},
		{
			label: t(($) => $.delete.label, { ns: PluginId }),
			iconButtonProps: {
				icon: deleteIcon,
				active: activeTool.value === 'delete',
				onClick: () => {
					onButtonClick('delete')
				},
			},
		},
		{
			label: t(($) => $.upload.label, { ns: PluginId }),
			iconButtonProps: {
				icon: uploadIcon,
				onClick: drawStore.upload,
			},
		},
		{
			label: t(($) => $.download.label, { ns: PluginId }),
			iconButtonProps: {
				icon: downloadIcon,
				onClick: drawStore.download,
			},
			// TODO: once multiple formats are allowed, add options for downloadFormat
		},
	].filter((x) => Boolean(x))
)
</script>

<style scoped>
.polar-draw-gadget {
	scrollbar-gutter: stable;
}

:deep(.draw-gadget-button button) {
	box-shadow:
		rgba(0, 0, 0, 0.1) 0 1px 3px 0,
		rgba(0, 0, 0, 0.06) 0 1px 2px 0;
}

.kern-divider {
	width: 100%;
}
</style>
