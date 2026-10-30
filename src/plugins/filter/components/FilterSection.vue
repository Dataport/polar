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

import FilterSectionNineRegions from './FilterSectionNineRegions.vue'
import FilterSectionStandard from './FilterSectionStandard.vue'

const props = defineProps<{
	title: string
}>()

const coreStore = useCoreStore()
</script>
