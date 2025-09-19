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
					:class="buttonClass"
					:hint="hint ? hint : `hints.${plugin.id}`"
					hint-namespace="iconMenu"
					:icon="icon"
					tooltip-position="right"
					@click="() => toggle(index)"
				/>
				<!-- Content is otherwise displayed in MoveHandle of the core. -->
				<component
					:is="plugin.component"
					v-if="open === index && (!hasWindowSize || !hasSmallWidth)"
					class="polar-plugin-icon-menu-list-item-content"
					:style="`max-height: ${maxHeight};`"
				/>
			</template>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { toMerged } from 'es-toolkit'
import { useCoreStore } from '@/core/stores/export'
import { useIconMenuStore } from '@/plugins/iconMenu/store'
import PolarIconButton from '@/components/PolarIconButton.ce.vue'

const coreStore = useCoreStore()
const {
	clientHeight,
	deviceIsHorizontal,
	hasSmallWidth,
	hasWindowSize,
	layout,
} = storeToRefs(coreStore)
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

const maxHeight = computed(() =>
	hasWindowSize.value
		? 'inherit'
		: `calc(${clientHeight.value}px - ${
				deviceIsHorizontal.value ? 'calc(100% + 1.5em)' : '1em'
			})`
)

function toggle(index: number) {
	if (open.value === index) {
		open.value = -1
		coreStore.setMoveHandle(null)
	} else {
		open.value = index
		iconMenuStore.openInMoveHandle(index)
	}
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
	position: absolute;
	list-style: none;
	height: calc(100% - 1rem);
	padding: 0;
	margin: 0.5rem;
	border-radius: 0.5rem;
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
			left: calc(100% + 0.5rem);
			overflow-y: auto;
			scrollbar-gutter: stable;
		}
	}
}

.polar-plugin-icon-menu-list-full-page {
	padding: 0.5rem;
}
</style>
