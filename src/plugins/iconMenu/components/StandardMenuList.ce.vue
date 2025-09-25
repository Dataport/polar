<template>
	<ul class="polar-plugin-icon-menu-list">
		<li
			v-for="({ buttonClass, hint, icon, plugin }, index) of menus"
			:key="index"
			class="polar-plugin-icon-menu-list-item"
		>
			<component :is="plugin.component" v-if="icon === undefined" />
			<template v-else>
				<PolarIconButton
					:class="buttonClass"
					:hint="hint ? hint : `hints.${plugin.id}`"
					hint-namespace="iconMenu"
					:icon="icon"
					tooltip-position="left"
					@click="() => toggle(baseIndex + index)"
				/>
				<!-- Content is otherwise displayed in MoveHandle of the core. -->
				<component
					:is="plugin.component"
					v-if="
						open === baseIndex + index && (!hasWindowSize || !hasSmallWidth)
					"
					ref="pluginComponent"
					class="polar-plugin-icon-menu-list-item-content"
					:style="`max-height: ${maxHeight}; max-width: ${maxWidth}`"
				/>
			</template>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
	type Component,
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	useTemplateRef,
	watch,
} from 'vue'
import { useIconMenuStore } from '../store'
import type { Menu } from '../types'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores/export'

withDefaults(
	defineProps<{
		menus: (Menu & { buttonClass: string })[]
		baseIndex?: number
	}>(),
	{ baseIndex: 0 }
)

const coreStore = useCoreStore()
const { deviceIsHorizontal, hasSmallWidth, hasWindowSize } =
	storeToRefs(coreStore)
const iconMenuStore = useIconMenuStore()
const { open } = storeToRefs(iconMenuStore)

const maxWidth = ref('inherit')
const pluginComponent = useTemplateRef<[Component]>('pluginComponent')

const maxHeight = computed(() =>
	hasWindowSize.value
		? 'inherit'
		: `calc(${coreStore.clientHeight}px - ${
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
	// Note: Not relevant here as nothing is followed by the nextTick call.
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

function toggle(index: number) {
	if (open.value === index) {
		open.value = -1
		// TODO(dopenguin): This is called in mainStore
		// setMoveHandle(null)
	} else {
		open.value = index
		// iconMenuStore.openInMoveHandle(index)
	}
	updateMaxWidth()
}
</script>

<style scoped>
.polar-icon-button.polar-plugin-icon-menu-button {
	box-shadow: none;
}

.polar-icon-button.polar-plugin-icon-menu-button-active {
	background: oklch(var(--theme-action-default) / 0.12);

	&:focus,
	&:hover {
		background: oklch(var(--theme-action-default) / 0.12);
	}
}

.polar-plugin-icon-menu-list {
	list-style: none;
	margin: 0;
	padding: 0;
	border-radius: 0.5rem;
	background: var(--kern-color-layout-background-default);
	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);

	.polar-plugin-icon-menu-list-item {
		float: left;
		margin-bottom: 0;

		.polar-plugin-icon-menu-list-item-content {
			z-index: 1;
			position: absolute;
			top: calc(100% + 0.5rem);
			right: 0;
			white-space: nowrap;
			overflow-y: auto;
			scrollbar-gutter: stable;
		}
	}
	.polar-plugin-icon-menu-list-item:nth-child(n + 2) {
		margin-left: 3px;
	}
}
</style>
