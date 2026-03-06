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
import { useCoreStore } from '@/core/stores'

import { useIconMenuStore } from '../store'

const props = defineProps<{
	icon: string
	id: string
	hint: string
}>()

const iconMenuStore = useIconMenuStore()
const { open } = storeToRefs(iconMenuStore)
const active = computed(() => open.value === props.id)

const updateMaxWidth = inject('updateMaxWidth') as () => void

function toggle() {
	if (open.value === props.id) {
		open.value = null
		useCoreStore().setMoveHandle(null)
	} else {
		open.value = props.id
		iconMenuStore.openInMoveHandle(props.id)
	}
	updateMaxWidth()
}
</script>
