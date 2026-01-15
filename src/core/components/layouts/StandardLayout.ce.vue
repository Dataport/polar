<template>
	<component
		:is="component"
		v-for="({ component, id }, index) of uiPlugins"
		:key="`${id}-${index}`"
		class="layout"
	/>
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
	max-width: 100%;

	& > * {
		pointer-events: all;
	}

	&.has-window-size {
		max-height: 100%;
	}
}
</style>
