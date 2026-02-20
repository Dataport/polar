<template>
	<div class="polar-plugin-icon-menu-focus-list-wrapper">
		<!-- Content is otherwise displayed in MoveHandle of the core. -->
		<component
			:is="pluginComponent"
			v-if="pluginComponent && (!hasWindowSize || !hasSmallWidth)"
			class="polar-plugin-icon-menu-focus-list-content"
			:style="`max-height: ${maxHeight}`"
		/>
		<ul class="polar-plugin-icon-menu-focus-list" :style="bottom">
			<li
				v-for="{ buttonClass, icon, plugin } of menus"
				:key="plugin.id"
				class="polar-plugin-icon-menu-focus-list-item"
			>
				<button
					class="kern-btn kern-btn--secondary polar-plugin-icon-menu-button"
					:class="buttonClass"
					@click="() => toggle(plugin.id)"
				>
					<span class="kern-icon" :class="icon" aria-hidden="true" />
					<span class="kern-label">
						{{ t(($) => $.hints[plugin.id], { ns: 'iconMenu' }) }}
					</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { type Component, computed, markRaw, ref } from 'vue'

import { useCoreStore } from '@/core/stores'

import type { Menu } from '../types'

import { useIconMenuStore } from '../store'

const props = defineProps<{
	menus: (Menu & { buttonClass: string; icon: string })[]
}>()

const coreStore = useCoreStore()
const { clientHeight, hasSmallWidth, hasWindowSize, moveHandleTop } =
	storeToRefs(coreStore)
const iconMenuStore = useIconMenuStore()

const pluginComponent = ref<Component | null>(null)

const bottom = computed(
	() =>
		`bottom: ${
			hasWindowSize.value && moveHandleTop.value !== null
				? Math.min(
						clientHeight.value - moveHandleTop.value,
						clientHeight.value / 4
					) / 16
				: coreStore.getPluginStore('footer') === null
					? 0
					: 1.5
		}rem`
)
const maxHeight = computed(() =>
	hasWindowSize.value
		? 'inherit'
		: `calc(${coreStore.clientHeight}px - ${
				coreStore.deviceIsHorizontal ? 'calc(100% + 1.5em)' : '1em'
			})`
)

function toggle(id: string) {
	if (iconMenuStore.focusOpen === id) {
		iconMenuStore.focusOpen = null
		pluginComponent.value = null
		coreStore.setMoveHandle(null)
	} else {
		iconMenuStore.focusOpen = id
		pluginComponent.value = markRaw(
			(props.menus.find(({ plugin }) => plugin.id === id) as Menu).plugin
				.component as Component
		)
		iconMenuStore.openInMoveHandle(id, true)
	}
}
</script>

<style scoped>
.polar-plugin-icon-menu-focus-list-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;

	.polar-plugin-icon-menu-focus-list {
		list-style: none;
		position: absolute;
		padding: 0;
		border-radius: 0.5rem;
		background: var(--kern-color-layout-background-default);
		box-shadow: var(--polar-shadow);
		transition: bottom 0.25s ease;
		z-index: 1;

		.polar-plugin-icon-menu-focus-list-item {
			margin-bottom: 0;

			.polar-plugin-icon-menu-button {
				box-shadow: none;
				border: none;

				&:focus,
				&:hover {
					background: var(--kern-color-layout-background-default);
					border: solid var(--kern-color-action-on-default);
					outline: solid var(--kern-color-action-default);
				}
			}

			.polar-plugin-icon-menu-button-active {
				background: color-mix(
					in oklch,
					var(--kern-color-action-default) 12%,
					transparent
				);

				&:focus,
				&:hover {
					background: color-mix(
						in oklch,
						var(--kern-color-action-default) 12%,
						transparent
					);
				}
			}
		}
	}

	.polar-plugin-icon-menu-focus-list-content {
		z-index: 2;
		position: absolute;
		/** TODO(dopenguin): Update values depending on whether the search is displayed or not. It should generally be displayed below the toasts. */
		top: 0;
		left: 0;
		margin: var(--kern-metric-space-small);
		white-space: nowrap;
		overflow-y: auto;
		scrollbar-gutter: stable;
	}
}
</style>
