<template>
	<section v-if="showTextOptions" class="polar-plugin-draw-text">
		<div v-if="showSizeSlider" class="kern-form-input">
			<label class="kern-label" for="polar-plugin-draw-slider">
				{{ $t(($) => $.text.size, { ns: PluginId }) }}
			</label>
			<div class="polar-plugin-draw-slider-container">
				<input
					id="polar-plugin-draw-slider"
					v-model="textSizeIndex"
					class="polar-plugin-draw-slider"
					type="range"
					:min="0"
					:max="textSizes.length - 1"
				/>
				{{ textSizes[textSizeIndex] }}
			</div>
		</div>
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

	.polar-plugin-draw-slider-container {
		display: flex;
		align-items: center;
		gap: var(--kern-metric-space-default);
		width: 100%;

		.polar-plugin-draw-slider {
			flex-grow: 1;
		}
	}
}
</style>
