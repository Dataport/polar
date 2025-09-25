<template>
	<component :is="asList ? 'ul' : 'div'" class="polar-plugin-icon-menu-list">
		<component
			:is="asList ? 'li' : 'div'"
			v-for="({ plugin, icon, hint }, index) of menus.flat()"
			:key="index"
			:class="
				deviceIsHorizontal
					? 'polar-plugin-icon-menu-list-item-horizontal'
					: 'polar-plugin-icon-menu-list-item'
			"
		>
			<component :is="plugin.component" v-if="icon === undefined" />
			<template v-else>
				<component
					:is="buttonComponent"
					v-if="buttonComponent"
					:id="plugin.id"
					:icon="icon"
					:hint="hint ?? `hints.${plugin.id}`"
					:index="index"
				/>
				<NineRegionsButton
					v-else
					:icon="icon"
					:hint="hint ? hint : `hints.${plugin.id}`"
					:index="index"
				/>
				<!-- Content is otherwise displayed in MoveHandle of the core. -->
				<component
					:is="plugin.component"
					v-if="open === index && (!hasWindowSize || !hasSmallWidth)"
					ref="pluginComponent"
					:class="[
						deviceIsHorizontal
							? 'polar-plugin-icon-menu-list-item-content-horizontal'
							: 'polar-plugin-icon-menu-list-item-content',
						'polar-plugin-icon-menu-list-item-content-scrollable-y',
					]"
					:style="`max-height: ${maxHeight}; max-width: ${maxWidth}`"
				/>
			</template>
		</component>
	</component>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	provide,
	ref,
	useTemplateRef,
	watch,
} from 'vue'
import { useIconMenuStore } from '../store'
import NineRegionsButton from './NineRegionsButton.ce.vue'
import { useCoreStore } from '@/core/stores/export'

const { clientHeight, deviceIsHorizontal, hasSmallWidth, hasWindowSize } =
	storeToRefs(useCoreStore())
const { buttonComponent, menus, open } = storeToRefs(useIconMenuStore())

const maxWidth = ref('inherit')
const pluginComponent = useTemplateRef('pluginComponent')

const asList = computed(() => menus.value.length > 1)
const maxHeight = computed(() =>
	hasWindowSize.value
		? 'inherit'
		: `calc(${clientHeight.value}px - ${
				deviceIsHorizontal.value ? 'calc(100% + 1.5em)' : '1em'
			})`
)

// Fixes an issue if the orientation of a mobile device is changed while a plugin is open.
watch(deviceIsHorizontal, (newValue) => {
	if (!newValue) {
		updateMaxWidth()
	}
})

onMounted(() => {
	addEventListener('resize', updateMaxWidth)
	updateMaxWidth()
})
onBeforeUnmount(() => {
	removeEventListener('resize', updateMaxWidth)
})

function updateMaxWidth() {
	// NOTE: Not relevant here as nothing is followed by the nextTick call.
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	nextTick(() => {
		if (pluginComponent.value?.[0]) {
			if (!hasWindowSize.value) {
				const { left, width } = (
					pluginComponent.value[0]['$el'] as HTMLElement
				).getBoundingClientRect()
				maxWidth.value = `${width + left}px`
			} else {
				maxWidth.value = 'inherit'
			}
		}
	})
}
provide('updateMaxWidth', updateMaxWidth)
</script>

<style scoped>
.polar-plugin-icon-menu-list {
	position: relative;
	list-style: none;
	padding: 0;
	margin: 0.5rem;
}

.polar-plugin-icon-menu-list-item-horizontal {
	float: left;
	margin-left: 0.5rem;
}

.polar-plugin-icon-menu-list-item {
	margin-bottom: 0.5rem;
	z-index: 1;
}

.polar-plugin-icon-menu-list-item-content {
	position: absolute;
	white-space: nowrap;
	top: 0;
	right: calc(100% + 0.5em);
}

.polar-plugin-icon-menu-list-item-content-horizontal {
	position: absolute;
	white-space: nowrap;
	top: calc(100% + 0.5em);
	right: -0.5em;
}

.polar-plugin-icon-menu-list-item-content-scrollable-y {
	z-index: 1;
	overflow-y: auto;
	scrollbar-gutter: stable;
}
</style>
