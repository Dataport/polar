<template>
	<section ref="section" class="polar-filter-section">
		<h3 class="kern-heading-small">
			{{ $t(($) => $.time.header, { ns: PluginId }) }}
		</h3>
		<div class="polar-filter-category-values">
			<component
				:is="
					coreStore.layout === 'standard'
						? KernBlockButtonRadioGroup
						: KernRadioGroup
				"
				v-model="filterStore.timeModel"
				:items="filterStore.timeItems"
				@update:model-value="scrollVisible($event)"
			/>
		</div>
		<KernDateRangePicker
			v-if="filterStore.timeModel === 'custom'"
			v-model:start="filterStore.timeStart"
			v-model:end="filterStore.timeEnd"
			v-bind="filterStore.timeConstraints"
		/>
	</section>
</template>

<script setup lang="ts">
import { nextTick, useTemplateRef } from 'vue'

import KernBlockButtonRadioGroup from '@/components/kern/KernBlockButtonRadioGroup.ce.vue'
import KernDateRangePicker from '@/components/kern/KernDateRangePicker.ce.vue'
import KernRadioGroup from '@/components/kern/KernRadioGroup.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useFilterStore } from '../store'
import { PluginId } from '../types'

const coreStore = useCoreStore()
const filterStore = useFilterStore()

const section = useTemplateRef<HTMLElement>('section')

async function scrollVisible(model: string) {
	if (model === 'custom') {
		await nextTick()
		if (section.value?.lastElementChild?.scrollIntoView) {
			section.value.lastElementChild.scrollIntoView({
				behavior: 'smooth',
			})
		}
	}
}
</script>
