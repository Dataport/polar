<template>
	<component
		:is="component"
		v-for="({ component, id }, index) of uiPlugins"
		:key="`${id}-${index}`"
	/>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMainStore } from '@/core/stores/main.ts'

const coreStore = useMainStore()

const uiPlugins = computed(() =>
	coreStore.plugins.filter((plugin) => plugin.component)
)
</script>

<style lang="scss" scoped></style>
