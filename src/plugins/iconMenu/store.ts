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

	const menus = ref<Array<Menu[]>>([])
	const focusMenus = ref<(Menu & { icon: string })[]>([])
	const open = ref(-1)
	const focusOpen = ref(-1)

	const buttonComponent = computed(() =>
		coreStore.configuration.iconMenu?.buttonComponent
			? markRaw(coreStore.configuration.iconMenu.buttonComponent)
			: null
	)

	function setupPlugin() {
		menus.value = (coreStore.configuration.iconMenu?.menus || []).map(
			(menuGroup) =>
				menuGroup.filter(({ plugin: { id } }) => {
					const display = coreStore.configuration[id]?.displayComponent
					return typeof display === 'boolean' ? display : true
				})
		)
		focusMenus.value = (
			coreStore.configuration.iconMenu?.focusMenus || []
		).filter(({ plugin: { id } }) => {
			const display = coreStore.configuration[id]?.displayComponent
			return typeof display === 'boolean' ? display : true
		})

		menus.value
			.concat(focusMenus.value)
			.flat()
			.forEach(({ plugin }) => {
				addPlugin(toMerged(plugin, { independent: false }))
			})

		// Otherwise, the component itself is made reactive
		menus.value.map((menuGroup) =>
			menuGroup.map((menuItem) =>
				toMerged(menuItem, {
					plugin: {
						component: markRaw(menuItem.plugin.component as Component),
					},
				})
			)
		)
		focusMenus.value.map((menuItem) =>
			toMerged(menuItem, {
				plugin: {
					component: markRaw(menuItem.plugin.component as Component),
				},
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
		const focusInitiallyOpen =
			coreStore.configuration.iconMenu?.focusInitiallyOpen
		if (
			!coreStore.hasSmallHeight &&
			!coreStore.hasSmallWidth &&
			focusInitiallyOpen
		) {
			openFocusMenuById(focusInitiallyOpen)
		}
	}
	function teardownPlugin() {}

	function openMenuById(openId: string) {
		const index = menus.value.reduce((foundIndex, menuGroup, outerIndex) => {
			const innerIndex = menuGroup.findIndex(
				({ plugin: { id } }) => id === openId
			)
			if (innerIndex === -1) {
				if (foundIndex !== -1) {
					return foundIndex
				}
				return -1
			}
			return outerIndex + innerIndex
		}, -1)

		if (index !== -1) {
			open.value = index
			// openInMoveHandle(index)
		}
	}
	function openFocusMenuById(openId: string) {
		const index = focusMenus.value.findIndex(
			({ plugin: { id } }) => id === openId
		)

		if (index !== -1) {
			focusOpen.value = index
			// openInMoveHandle(index, true)
		}
	}
	// TODO(dopenguin): Implement once MoveHandle is implemented
	/* function openInMoveHandle(index: number, focusMenu = false) {
		const { hint, plugin } = focusMenu
			? focusMenus.value[index]
			: menus.value[index]
		commit(
			'setMoveHandle',
			{
				closeLabel: t('mobileCloseButton', {
					ns: 'iconMenu',
					plugin: hint || `plugins.iconMenu.hints.${plugin.id}`,
				}),
				closeFunction: () => {
					if (focusMenu) {
						focusOpen.value = -1
						return
					}
					open.value = -1
				},
				component: plugin,
				plugin: 'iconMenu',
			},
			{ root: true }
		)
	} */

	return {
		menus,
		focusMenus,
		open,
		focusOpen,
		buttonComponent,
		openMenuById,
		openFocusMenuById,
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
