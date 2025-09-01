<template>
	<ul
		class="polar-plugin-icon-menu-list"
		:class="{ 'polar-plugin-icon-menu-list-full-page': hasWindowSize }"
	>
		<li
			v-for="({ buttonClass, hint, icon, plugin }, index) of menus"
			:key="index"
			class="polar-plugin-icon-menu-list-item"
		>
			<component :is="plugin.component" v-if="icon === undefined" />
			<template v-else>
				<PolarIconButton
					:action="() => toggle(index)"
					:button-class="buttonClass"
					:hint="hint ? hint : `hints.${plugin.id}`"
					hint-namespace="iconMenu"
					:icon="icon"
					tooltip-position="right"
				/>
				<!-- Content is otherwise displayed in MoveHandle of the core. -->
				<component
					:is="plugin.component"
					v-if="open === index && (!hasWindowSize || !hasSmallWidth)"
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
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	useTemplateRef,
	watch,
} from 'vue'
import { toMerged } from 'es-toolkit'
import { useCoreStore } from '@/core/stores/export.ts'
import { useIconMenuStore } from '@/plugins/iconMenu/store.ts'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'

const {
	clientHeight,
	deviceIsHorizontal,
	hasSmallWidth,
	hasWindowSize,
	layout,
} = storeToRefs(useCoreStore())
const iconMenuStore = useIconMenuStore()
const { open } = storeToRefs(iconMenuStore)

const menus = computed(() =>
	iconMenuStore.menus.map((menu, index) =>
		toMerged(menu, {
			buttonClass: [
				layout.value === 'standard' ? 'polar-plugin-icon-menu-button' : '',
				open.value === index ? ' polar-plugin-icon-menu-button-active' : '',
			].reduce((a, b) => a.concat(' ', b)),
		})
	)
)

// TODO(dopenguin): Menu bar is shown at the bottom on mobile

const maxWidth = ref('inherit')
const pluginComponent = useTemplateRef('pluginComponent')

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
	// Note: Not relevant here as nothing is followed by the nextTick call.
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	nextTick(() => {
		if (pluginComponent.value?.[0]) {
			if (!hasWindowSize.value) {
				// IntelliSense works, but the type is not correctly asserted so typing is required
				const { left, width }: DOMRect =
					pluginComponent.value[0].$el.getBoundingClientRect()
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
:deep(.polar-plugin-icon-menu-button) {
	box-shadow: none;
}

:deep(.polar-plugin-icon-menu-button-active) {
	background: oklch(var(--theme-action-default) / 0.12);

	&:focus,
	&:hover {
		background: oklch(var(--theme-action-default) / 0.12);
	}
}

.polar-plugin-icon-menu-list {
	position: absolute;
	list-style: none;
	height: calc(100% - 16px);
	padding: 0;
	margin: 8px;
	border-radius: 8px;
	background: var(--kern-color-layout-background-default);
	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);

	.polar-plugin-icon-menu-list-item {
		margin-bottom: 3px;

		.polar-plugin-icon-menu-list-item-content {
			z-index: 1;
			position: absolute;
			top: 0;
			left: calc(100% + 0.5em);
			white-space: nowrap;
			overflow-y: auto;
			scrollbar-gutter: stable;
		}
	}
}

.polar-plugin-icon-menu-list-full-page {
	padding: 8px;
}
</style>
