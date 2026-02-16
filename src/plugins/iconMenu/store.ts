/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/iconMenu/store
 */
/* eslint-enable tsdoc/syntax */

import { toMerged } from 'es-toolkit'
import { t } from 'i18next'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { type Component, computed, markRaw, ref } from 'vue'

import { useCoreStore } from '@/core/stores'

import type { Menu } from './types'

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
	const open = ref<string | null>(null)
	const focusOpen = ref<string | null>(null)

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
				coreStore.addPlugin(toMerged(plugin, { independent: false }))
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
		const entry = menus.value.flat().find(({ plugin: { id } }) => id === openId)

		if (entry) {
			open.value = openId
			openInMoveHandle(openId)
		}
	}

	function openFocusMenuById(openId: string) {
		const entry = focusMenus.value.find(({ plugin: { id } }) => id === openId)

		if (entry) {
			focusOpen.value = openId
			openInMoveHandle(openId, true)
		}
	}

	function openInMoveHandle(openId: string, focusMenu = false) {
		const menu = (focusMenu ? focusMenus.value : menus.value.flat()).find(
			({ plugin: { id } }) => id === openId
		)
		if (!menu) {
			console.error(`Menu with index ${openId} could not be found.`)
			return
		}
		if (!menu.plugin.component) {
			console.error(
				`The plugin ${menu.plugin.id} does not have any component to display and thus can not be opened in the moveHandle.`
			)
			return
		}
		// Content is displayed in the MoveHandle in this case. Thus, only one menu can be open at a time.
		if (coreStore.hasWindowSize && coreStore.hasSmallWidth) {
			if (focusMenu && open.value !== null) {
				open.value = null
			} else if (!focusMenu && focusOpen.value !== null) {
				focusOpen.value = null
			}
		}
		coreStore.setMoveHandle({
			closeFunction: () => {
				if (focusMenu) {
					focusOpen.value = null
					return
				}
				open.value = null
			},
			closeLabel: t(($) => $.mobileCloseButton, {
				ns: 'iconMenu',
				plugin: t(($) => $.hints[menu.plugin.id], { ns: 'iconMenu' }),
			}),
			component: menu.plugin.component,
			plugin: 'iconMenu',
		})
	}

	return {
		menus,
		focusMenus,
		open,
		focusOpen,
		buttonComponent,
		openInMoveHandle,
		openMenuById,
		openFocusMenuById,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useIconMenuStore, import.meta.hot))
}
