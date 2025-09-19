/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/iconMenu/store
 */
/* eslint-enable tsdoc/syntax */

import { toMerged } from 'es-toolkit'
import { defineStore } from 'pinia'
import { type Component, computed, markRaw, ref } from 'vue'
import type { Menu } from './types'
import { addPlugin } from '@/core'
import { useCoreStore } from '@/core/stores/export'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the icon menu.
 */
/* eslint-enable tsdoc/syntax */
export const useIconMenuStore = defineStore('plugins/iconMenu', () => {
	const coreStore = useCoreStore()

	const menus = ref<Menu[]>([])
	const open = ref(-1)

	const buttonComponent = computed(() =>
		coreStore.configuration.iconMenu?.buttonComponent
			? markRaw(coreStore.configuration.iconMenu.buttonComponent)
			: null
	)

	function setupPlugin() {
		menus.value = (coreStore.configuration.iconMenu?.menus || []).filter(
			({ plugin: { id } }) => {
				const display = coreStore.configuration[id]?.displayComponent
				return typeof display === 'boolean' ? display : true
			}
		)
		menus.value.forEach(({ plugin }) => {
			addPlugin(toMerged(plugin, { independent: false }))
		})
		// Otherwise, the component itself is made reactive
		menus.value.map((menuItem) =>
			toMerged(menuItem, {
				plugin: { component: markRaw(menuItem.plugin.component as Component) },
			})
		)

		const initiallyOpen = coreStore.configuration.iconMenu?.initiallyOpen
		if (
			!coreStore.hasSmallHeight &&
			!coreStore.hasSmallWidth &&
			initiallyOpen
		) {
			openMenuById(initiallyOpen)
		}
	}
	function teardownPlugin() {}

	function openMenuById(openId: string) {
		const index = menus.value.findIndex(({ plugin: { id } }) => id === openId)

		if (index !== -1) {
			open.value = index
			// openInMoveHandle(index)
		}
	}

	function openInMoveHandle(index: number) {
		const menu = menus.value[index]
		if (!menu) {
			console.error(`Menu with index ${index} could not be found.`)
			return
		}
		if (!menu.plugin.component) {
			console.error(
				`The plugin ${menu.plugin.id} does not have any component to display and thus can not be opened in the moveHandle.`
			)
			return
		}
		coreStore.setMoveHandle({
			closeFunction: () => {
				open.value = -1
			},
			closeLabel: 'mobileCloseButton',
			closeLabelOptions: {
				ns: 'iconMenu',
				plugin: menu.hint || `plugins.iconMenu.hints.${menu.plugin.id}`,
			},
			component: menu.plugin.component,
			plugin: 'iconMenu',
		})
	}

	return {
		menus,
		open,
		buttonComponent,
		openInMoveHandle,
		openMenuById,
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
