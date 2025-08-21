<template>
	<div
		v-for="([name, classes], index) of tags"
		:key="index"
		:class="{ [classes]: true, 'has-window-size': hasWindowSize }"
		class="layout-region"
	>
		<component
			:is="plugin.component"
			v-for="(plugin, innerIndex) of regions[name]"
			:key="`${index}-${innerIndex}`"
		/>
	</div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useMainStore } from '@/core/stores/main.ts'
import { NineLayoutTag } from '@/core/utils/NineLayoutTag'

const tags = Object.entries(NineLayoutTag)

const coreStore = useMainStore()
const { hasWindowSize } = storeToRefs(coreStore)

const regions = computed(() =>
	tags.reduce(
		(acc, [name]) => ({
			...acc,
			[name]: coreStore.plugins
				.filter(({ id, independent, options }) => {
					if (options?.displayComponent && !options.layoutTag) {
						console.warn(
							`Component of plugin "${id}" was registered as visible ('displayComponent' had a truthy value), but no 'layoutTag' was associated. This may be an error in configuration and will lead to the component not being visible in the UI.`
						)
						return false
					}
					const display =
						typeof options?.displayComponent === 'boolean'
							? options.displayComponent
							: false
					return typeof independent === 'boolean'
						? display && independent
						: display
				})
				.filter(({ options }) => options?.layoutTag === name),
		}),
		{}
	)
)
</script>

<style scoped>
.layout-region {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: absolute;
	max-width: 100%;

	& > * {
		pointer-events: all;
	}

	&.has-window-size {
		max-height: 100%;
	}

	&.mid {
		top: 33%;
		left: 33%;
		right: 33%;
		bottom: 33%;
	}

	&.left {
		left: 0;
		right: auto;
		align-items: flex-start;
	}

	&.right {
		right: 0;
		left: 66%;
		align-items: flex-end;
	}

	&.top {
		top: 0;
		justify-content: flex-start;
	}

	&.bottom {
		bottom: 0;
		justify-content: flex-end;
	}
}
</style>
