<template>
	<div class="polar-plugin-icon-menu-list-wrapper">
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
import { computed } from 'vue'
import { useIconMenuStore } from '../store'
import StandardFocusMenu from './StandardFocusMenu.ce.vue'
import StandardMenuList from './StandardMenuList.ce.vue'
import { useCoreStore } from '@/core/stores/export'

const iconMenuStore = useIconMenuStore()

const menus = computed(() =>
	iconMenuStore.menus.map((menuGroup, outerIndex) =>
		menuGroup.map((menu, index) =>
			toMerged(menu, {
				buttonClass: [
					useCoreStore().layout === 'standard'
						? 'polar-plugin-icon-menu-button'
						: '',
					iconMenuStore.open === outerIndex + index
						? ' polar-plugin-icon-menu-button-active'
						: '',
				].reduce((a, b) => a.concat(' ', b)),
				icon: 'icon' in menu ? menu.icon : menu.plugin.icon,
			})
		)
	)
)
const focusMenus = computed(() =>
	iconMenuStore.focusMenus.map((menu, index) =>
		toMerged(menu, {
			buttonClass:
				iconMenuStore.focusOpen === index
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
	justify-content: center;
	align-items: center;
	gap: 0.25rem;
	margin: 0.5rem;
}
</style>
