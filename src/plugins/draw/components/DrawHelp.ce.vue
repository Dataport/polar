<template>
	<!-- TODO: These maybe should be placed elsewhere -->
	<section v-if="helpText" class="draw-help">
		<p class="kern-body">
			{{ $t(($) => $.help.text[helpText], { ns: PluginId }) }}
		</p>

		<span
			v-for="({ icon, label, alt }, index) in helpIcons"
			:key="index"
			class="kern-badge kern-badge--info"
		>
			<!-- TODO: Mobile has bad luck -->
			{{ alt ? modifier : '' }}
			<span :class="icon" aria-hidden="true" />
			<span class="kern-label">
				{{ $t(($) => $.help.tooltip[label], { ns: PluginId }) }}
			</span>
		</span>
	</section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useDrawStore } from '../store'
import { PluginId } from '../types'

const drawStore = useDrawStore()
const { activeTool, drawMode, editMode, drawing } = storeToRefs(drawStore)

const modifier = computed(() =>
	navigator.userAgent.indexOf('Mac') !== -1 ? 'Option (⌥) + ' : 'Alt + '
)

const helpText = computed(() => {
	if (activeTool.value === 'draw') {
		return drawMode.value
	} else if (activeTool.value === 'edit') {
		return editMode.value
	} else if (activeTool.value === 'delete') {
		return activeTool.value
	}
	return ''
})

const helpIcons = computed(
	() =>
		({
			Point: [
				{
					icon: 'kern-icon kern-icon--mouse',
					label: 'clickDraw',
				},
			],
			LineString: drawing.value
				? [
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickContinue',
						},
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickEndDouble',
						},
					]
				: [
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickStart',
						},
					],
			Polygon: drawing.value
				? [
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickContinue',
						},
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickEndPolygon',
						},
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickEndDouble',
						},
					]
				: [
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickStart',
						},
					],
			Circle: drawing.value
				? [
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickEndCircle',
						},
					]
				: [
						{
							icon: 'kern-icon kern-icon--mouse',
							label: 'clickStart',
						},
					],

			Text: [/* TODO: fill */],
			modify: [
				// TODO: finish
				{
					icon: 'kern-icon kern-icon--mouse',
					label: 'clickAlt',
					alt: true,
				},
			],
			translate: [/* TODO: fill */],
			duplicate: [/* TODO: fill */],
			cut: [/* TODO: fill */],
			delete: [/* TODO: fill */],
			'': [/* TODO: fill */],
		})[helpText.value]
)
</script>

<style scoped>
.draw-help {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--kern-metric-dimension-2x-small);

	.kern-body {
		white-space: normal;
		width: 100%;
	}
}
</style>
