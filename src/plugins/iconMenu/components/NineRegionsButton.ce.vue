<template>
	<PolarIconButton
		:active="active"
		:hint="hint"
		hint-namespace="iconMenu"
		:icon="icon"
		tooltip-position="left"
		@click="toggle"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, inject } from 'vue'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useIconMenuStore } from '@/plugins/iconMenu/store'

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
		// TODO(dopenguin): This is called in mainStore
		// setMoveHandle(null)
	} else {
		open.value = props.index
		// iconMenuStore.openInMoveHandle(index)
	}
	updateMaxWidth()
}
</script>
