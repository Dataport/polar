<template>
	<section v-if="showTextOptions" class="polar-plugin-draw-text">
		<PolarRange
			v-if="showSizeSlider"
			v-model="textSizeIndex"
			name="polar-plugin-draw-slider"
			:label="$t(($) => $.text.size, { ns: PluginId })"
			:min="0"
			:max="textSizes.length - 1"
		>
			{{ textSizes[textSizeIndex] }}
		</PolarRange>
		<div class="kern-form-input">
			<label class="kern-label" for="polar-plugin-draw-textarea">
				{{ $t(($) => $.text.content, { ns: PluginId }) }}
			</label>
			<textarea
				id="polar-plugin-draw-textarea"
				v-model="textInput"
				class="kern-form-input__input"
				name="polar-plugin-draw-textarea"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarRange from '@/components/PolarRange.ce.vue'

import { useDrawStore } from '../store'
import { PluginId } from '../types'

const drawStore = useDrawStore()
const {
	activeTool,
	drawMode,
	editMode,
	textInput,
	textSizeIndex,
	textSizes,
	textIsSelected,
} = storeToRefs(drawStore)

const showSizeSlider = computed(() => textSizes.value.length > 1)

const showTextOptions = computed(
	() =>
		(activeTool.value === 'draw' && drawMode.value === 'Text') ||
		(activeTool.value === 'edit' &&
			editMode.value === 'modify' &&
			textIsSelected.value)
)
</script>

<style scoped>
.polar-plugin-draw-text {
	width: 100%;
}
</style>
