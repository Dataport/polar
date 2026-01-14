<template>
	<PolarIconButton
		:active="active"
		:hint="hint"
		:icon="icon"
		tooltip-position="left"
		@click="toggle"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, inject } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores/export'

import { useIconMenuStore } from '../store'

const props = defineProps<{
	icon: string
	index: number
	hint: string
}>()

const iconMenuStore = useIconMenuStore()
const { open } = storeToRefs(iconMenuStore)
const active = computed(() => open.value === props.index)

const updateMaxWidth = inject('updateMaxWidth') as () => void

function toggle() {
	if (open.value === props.index) {
		open.value = -1
		useCoreStore().setMoveHandle(null)
	} else {
		open.value = props.index
		iconMenuStore.openInMoveHandle(props.index)
	}
	updateMaxWidth()
}
</script>
