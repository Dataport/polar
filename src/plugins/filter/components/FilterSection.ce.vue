<template>
	<component
		:is="
			coreStore.layout === 'nineRegions'
				? FilterSectionNineRegions
				: FilterSectionStandard
		"
		v-bind="props"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
import { useCoreStore } from '@/core/stores'

import FilterSectionNineRegions from './FilterSectionNineRegions.ce.vue'
import FilterSectionStandard from './FilterSectionStandard.ce.vue'

const props = defineProps<{
	title: string
}>()

const coreStore = useCoreStore()
</script>
