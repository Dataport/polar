<template>
	<PolarCard class="polar-draw-gadget">
		<h2 class="kern-heading-medium">
			{{ $t(($) => $.label, { ns: PluginId }) }}
			<span class="kern-icon kern-icon-fill--brush" />
		</h2>

		<!-- TODO: on select, disable active interaction -->
		<!-- TODO: offer selection of available layers; show as disabled ones that are currently not visible -->
		<PolarSelect
			v-if="layerOptions.length > 1"
			:value="activeLayerId"
			:options="layerOptions"
			@update:value="activeLayerId = $event as string"
		/>

		<template v-for="(button, index) in buttons" :key="index">
			<PolarIconButtonSelect
				class="draw-gadget-button"
				:icon-button-props="button.iconButtonProps"
				:select-props="button.selectProps"
				:label="button.label"
			/>

			<DrawHelp v-if="button.iconButtonProps.active" :mode="button.label" />

			<!-- separates activatable tools from one-time effects -->
			<!-- TODO: gotta find a way to code this without a fixed 3 (config may hide stuff) -->
			<hr v-if="index === 3" class="kern-divider" aria-hidden="true" />
		</template>
	</PolarCard>
</template>

<script setup lang="ts">
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed, type Ref } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'
import PolarIconButtonSelect from '@/components/PolarIconButtonSelect.ce.vue'
import PolarSelect from '@/components/PolarSelect.ce.vue'

import { useDrawStore } from '../store'
import {
	type DownloadMode,
	type DrawMode,
	DrawModes,
	type EditMode,
	EditModes,
	PluginId,
	type PropertyMode,
	PropertyModes,
	type ToolMode,
} from '../types'
import {
	deleteIcon,
	downloadIcon,
	drawModeIcon,
	editModeIcon,
	propertyModeIcon,
	saveIcon,
	uploadIcon,
} from '../utils/icons'
import DrawHelp from './DrawHelp.ce.vue'

const drawStore = useDrawStore()
const {
	activeTool,
	drawMode,
	editMode,
	propertyMode,
	downloadFormat,
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

function createModeUpdater<T>(target: Ref<T>) {
	return (value: T) => {
		// interpret re-selecting same option as "no change"
		if (target.value === value) {
			return
		}
		target.value = value
	}
}

const onDrawModeUpdate = createModeUpdater<DrawMode>(drawMode)
const onEditModeUpdate = createModeUpdater<EditMode>(editMode)
const onPropertyModeUpdate = createModeUpdater<PropertyMode>(propertyMode)
const onDownloadFormatUpdate = createModeUpdater<DownloadMode>(downloadFormat)

// TODO: only add parts that are actually configured
const buttons = computed(() => [
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
			value: drawMode.value,
			'onUpdate:value': onDrawModeUpdate,
			options: DrawModes.map((mode) => ({
				value: mode,
				label: t(($) => $.drawMode[mode], { ns: PluginId }),
			})),
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
			value: editMode.value,
			'onUpdate:value': onEditModeUpdate,
			options: EditModes.map((mode) => ({
				value: mode,
				label: t(($) => $.editMode[mode], { ns: PluginId }),
			})),
		},
	},
	{
		label: t(($) => $.propertyMode.label, { ns: PluginId }),
		iconButtonProps: {
			icon: propertyModeIcon(propertyMode.value),
			active: activeTool.value === 'property',
			onClick: () => {
				onButtonClick('property')
			},
		},
		selectProps: {
			value: propertyMode.value,
			'onUpdate:value': onPropertyModeUpdate,
			options: PropertyModes.map((mode) => ({
				value: mode,
				label: t(($) => $.propertyMode[mode], { ns: PluginId }),
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
		label: t(($) => $.downloadFormat.label, { ns: PluginId }),
		iconButtonProps: {
			icon: downloadIcon,
			onClick: drawStore.download,
		},
		selectProps: {
			value: downloadFormat.value,
			'onUpdate:value': onDownloadFormatUpdate,
			options: [
				{
					value: 'geojson',
					label: t(($) => $.downloadFormat.geojson, { ns: PluginId }),
				},
			],
		},
	},
	{
		label: t(($) => $.save.label, { ns: PluginId }),
		iconButtonProps: {
			icon: saveIcon,
			onClick: drawStore.save,
		},
	},
])
</script>

<style scoped>
.polar-draw-gadget {
	scrollbar-gutter: stable;
}

:deep(.draw-gadget-button button) {
	box-shadow:
		rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
		rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.kern-heading-medium {
	display: flex;
	align-items: center;
	gap: var(--kern-metric-dimension-2x-small);
}

.kern-divider {
	width: 100%;
}
</style>
