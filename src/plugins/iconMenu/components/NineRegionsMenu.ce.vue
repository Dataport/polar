<template>
	<component :is="asList ? 'ul' : 'div'" class="polar-plugin-icon-menu-list">
		<component
			:is="asList ? 'li' : 'div'"
			v-for="(item, index) of menus"
			:key="index"
			:class="
				deviceIsHorizontal
					? 'polar-plugin-icon-menu-list-item-horizontal'
					: 'polar-plugin-icon-menu-list-item'
			"
		>
			<component
				:is="item.plugin.component"
				v-if="
					'icon' in item
						? typeof item.icon === 'undefined'
						: typeof item.plugin.icon === 'undefined'
				"
			/>
			<template v-else>
				<component
					:is="buttonComponent"
					v-if="buttonComponent"
					:id="item.plugin.id"
					:icon="'icon' in item ? item.icon : item.plugin.icon"
					:hint="
						$t(($) => $.hints[item.plugin.id], {
							ns: 'iconMenu',
						})
					"
				/>
				<NineRegionsButton
					v-else
					:id="item.plugin.id"
					:icon="('icon' in item ? item.icon : item.plugin.icon) ?? ''"
					:hint="
						$t(($) => $.hints[item.plugin.id], {
							ns: 'iconMenu',
						})
					"
				/>
				<!-- Content is otherwise displayed in MoveHandle of the core. -->
				<component
					:is="item.plugin.component"
					v-if="open === item.plugin.id && (!hasWindowSize || !hasSmallWidth)"
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

import { useCoreStore } from '@/core/stores'

import { useIconMenuStore } from '../store'
import NineRegionsButton from './NineRegionsButton.ce.vue'

const iconMenuStore = useIconMenuStore()
const { clientHeight, deviceIsHorizontal, hasSmallWidth, hasWindowSize } =
	storeToRefs(useCoreStore())
const { buttonComponent, open } = storeToRefs(iconMenuStore)

const maxWidth = ref('inherit')
const pluginComponent = useTemplateRef('pluginComponent')

const menus = computed(() => iconMenuStore.menus.flat())
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
	void nextTick(() => {
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
	margin: var(--kern-metric-space-small);
}

.polar-plugin-icon-menu-list-item-horizontal {
	float: left;
	margin-left: var(--kern-metric-space-small);
}

.polar-plugin-icon-menu-list-item {
	margin-bottom: var(--kern-metric-space-small);
	z-index: 1;
}

.polar-plugin-icon-menu-list-item-content {
	position: absolute;
	white-space: nowrap;
	top: 0;
	right: calc(100% + var(--kern-metric-space-small));
}

.polar-plugin-icon-menu-list-item-content-horizontal {
	position: absolute;
	white-space: nowrap;
	top: calc(100% + var(--kern-metric-space-small));
	right: calc(-1 * var(--kern-metric-space-small));
}

.polar-plugin-icon-menu-list-item-content-scrollable-y {
	z-index: 1;
	overflow-y: auto;
	scrollbar-gutter: stable;
}
</style>
