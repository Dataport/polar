<template>
	<div
		v-for="([name, classes], index) of tags"
		:key="index"
		:class="{ [classes]: true, 'has-window-size': hasWindowSize }"
		class="layout-region"
	>
		<!-- TODO(dopenguin): The component previously had this styling. Still needed?
		.polar-clickable > * {
  		pointer-events: all;
		} -->
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
import { NineLayoutTag } from '../../utils/NineLayoutTag'
import { useCoreStore } from '../../stores/core'

const tags = Object.entries(NineLayoutTag)

const coreStore = useCoreStore()
const { hasWindowSize, plugins } = storeToRefs(coreStore)

const regions = computed(() =>
	tags.reduce(
		(acc, [name]) => ({
			...acc,
			[name]: plugins.value.filter(
				({ options }) => options?.displayComponent && options.layoutTag === name
			),
		}),
		{}
	)
)
</script>

<style lang="scss" scoped>
.layout-region {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: absolute;
	max-width: 100%;

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
