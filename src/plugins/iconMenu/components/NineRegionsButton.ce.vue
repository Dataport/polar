<template>
	<!-- TODO(dopenguin): Tooltip is missing; tooltip is disabled if hasSmallDisplay is true -->
	<!-- TODO(dopenguin): Possible colour change is missing -->
	<button class="kern-btn kern-btn--primary" @click="toggle">
		<span class="kern-icon" :class="$props.icon" aria-hidden="true" />
		<span class="kern-label kern-sr-only">{{ hint }}</span>
	</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { inject } from 'vue'
// import { useCoreStore } from '@/core/stores/export.ts'
import { useIconMenuStore } from '@/plugins/iconMenu/store.ts'

const props = defineProps<{
	id: string
	icon: string
	index: number
	hint: string
}>()

/*
 * TODO: Enable when used
const coreStore = useCoreStore()
const { hasSmallDisplay } = storeToRefs(coreStore)
*/

const iconMenuStore = useIconMenuStore()
const { open } = storeToRefs(iconMenuStore)

const updateMaxWidth = inject('updateMaxWidth') as () => void

function toggle() {
	if (open.value === props.index) {
		open.value = -1
		// TODO(dopenguin): This is called in mainStore
		// setMoveHandle(null)
	} else {
		open.value = props.index
		// iconMenuStore.openInMoveHandle(index)
	}
	updateMaxWidth()
}
</script>

<style scoped></style>
