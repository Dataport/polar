<template>
	<div class="polar-plugin-icon-menu-focus-list-wrapper">
		<!-- Content is otherwise displayed in MoveHandle of the core. -->
		<component
			:is="pluginComponent"
			v-if="pluginComponent && (!hasWindowSize || !hasSmallWidth)"
			class="polar-plugin-icon-menu-focus-list-content"
			:style="`max-height: ${maxHeight}`"
		/>
		<ul class="polar-plugin-icon-menu-focus-list">
			<li
				v-for="({ buttonClass, icon, plugin }, index) of menus"
				:key="index"
				class="polar-plugin-icon-menu-focus-list-item"
			>
				<button
					class="kern-btn kern-btn--secondary polar-plugin-icon-menu-button"
					:class="buttonClass"
					@click="() => toggle(index)"
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
import { useIconMenuStore } from '../store'
import type { Menu } from '../types'
import { useCoreStore } from '@/core/stores/export'

const props = defineProps<{
	menus: (Menu & { buttonClass: string; icon: string })[]
}>()

const coreStore = useCoreStore()
const { hasSmallWidth, hasWindowSize } = storeToRefs(coreStore)
const iconMenuStore = useIconMenuStore()

const pluginComponent = ref<Component | null>(null)

const maxHeight = computed(() =>
	hasWindowSize.value
		? 'inherit'
		: `calc(${coreStore.clientHeight}px - ${
				coreStore.deviceIsHorizontal ? 'calc(100% + 1.5em)' : '1em'
			})`
)

function toggle(index: number) {
	if (iconMenuStore.focusOpen === index) {
		iconMenuStore.focusOpen = -1
		pluginComponent.value = null
		coreStore.setMoveHandle(null)
	} else {
		iconMenuStore.focusOpen = index
		pluginComponent.value = markRaw(
			(props.menus.find((_, i) => i === index) as Menu).plugin
				.component as Component
		)
		iconMenuStore.openInMoveHandle(index, true)
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
		bottom: 0;
		padding: 0;
		border-radius: 0.5rem;
		background: var(--kern-color-layout-background-default);
		box-shadow:
			0 1px 1px 0 rgba(53, 57, 86, 0.16),
			0 1px 2px 0 rgba(53, 57, 86, 0.25),
			0 1px 6px 0 rgba(110, 117, 151, 0.25);

		.polar-plugin-icon-menu-focus-list-item {
			margin-bottom: 0;

			.polar-plugin-icon-menu-button {
				box-shadow: none;
				border: none;
				pointer-events: all;

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
		z-index: 1;
		position: absolute;
		/** TODO(dopenguin): Update values depending on whether the search is displayed or not. It should generally be displayed below the toasts. */
		top: 0;
		left: 0;
		margin: 0.5rem;
		white-space: nowrap;
		overflow-y: auto;
		scrollbar-gutter: stable;
	}
}
</style>
