<template>
	<div
		v-for="({ component, id }, index) of uiPlugins"
		:key="`${id}-${index}`"
		class="layout"
	>
		<component :is="component" />
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { usePluginStore } from '../../stores/plugin'

const pluginStore = usePluginStore()

const uiPlugins = computed(() =>
	pluginStore.plugins.filter(
		({ component, independent }) =>
			component && (typeof independent === 'boolean' ? independent : true)
	)
)
</script>

<style scoped>
.layout {
	pointer-events: all;
}
</style>
