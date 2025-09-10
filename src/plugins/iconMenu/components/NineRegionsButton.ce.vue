<template>
	<PolarIconButton
		:active="active"
		:action="toggle"
		:hint="hint"
		hint-namespace="iconMenu"
		:icon="icon"
		tooltip-position="left"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { inject, onMounted, ref, watch } from 'vue'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useIconMenuStore } from '@/plugins/iconMenu/store'

const props = defineProps<{
	icon: string
	index: number
	hint: string
}>()

const iconMenuStore = useIconMenuStore()
const { open } = storeToRefs(iconMenuStore)
const active = ref(false)

const updateMaxWidth = inject('updateMaxWidth') as () => void

function toggle() {
	if (open.value === props.index) {
		open.value = -1
		active.value = false
		// TODO(dopenguin): This is called in mainStore
		// setMoveHandle(null)
	} else {
		open.value = props.index
		active.value = true
		// iconMenuStore.openInMoveHandle(index)
	}
	updateMaxWidth()
}

watch(open, (openMenu) => {
	active.value = openMenu === props.index
})

onMounted(() => {
	active.value = open.value === props.index
})
</script>
