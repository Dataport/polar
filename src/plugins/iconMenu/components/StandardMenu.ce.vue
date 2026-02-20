<template>
	<div
		class="polar-plugin-icon-menu-list-wrapper"
		:class="{
			'polar-plugin-icon-menu-list-wrapper-horizontal': deviceIsHorizontal,
		}"
	>
		<StandardMenuList
			v-for="(menu, outerIndex) of menus"
			:key="outerIndex"
			:menus="menu"
			:base-index="outerIndex"
		/>
	</div>
	<StandardFocusMenu v-if="focusMenus.length" :menus="focusMenus" />
</template>

<script setup lang="ts">
import { toMerged } from 'es-toolkit'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

import { useIconMenuStore } from '../store'
import StandardFocusMenu from './StandardFocusMenu.ce.vue'
import StandardMenuList from './StandardMenuList.ce.vue'

const { deviceIsHorizontal } = storeToRefs(useCoreStore())
const iconMenuStore = useIconMenuStore()

const menus = computed(() =>
	iconMenuStore.menus.map((menuGroup) =>
		menuGroup.map((menu) =>
			toMerged(menu, {
				buttonClass: [
					useCoreStore().layout === 'standard'
						? 'polar-plugin-icon-menu-button'
						: '',
					iconMenuStore.open === menu.plugin.id
						? ' polar-plugin-icon-menu-button-active'
						: '',
				].reduce((a, b) => a.concat(' ', b)),
				icon: 'icon' in menu ? menu.icon : menu.plugin.icon,
			})
		)
	)
)
const focusMenus = computed(() =>
	iconMenuStore.focusMenus.map((menu) =>
		toMerged(menu, {
			buttonClass:
				iconMenuStore.focusOpen === menu.plugin.id
					? 'polar-plugin-icon-menu-button-active'
					: '',
		})
	)
)
</script>

<style scoped>
.polar-plugin-icon-menu-list-wrapper {
	position: absolute;
	right: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: var(--kern-metric-space-x-small);
	margin: var(--kern-metric-space-small);
}

.polar-plugin-icon-menu-list-wrapper-horizontal {
	flex-direction: row;
}
</style>
