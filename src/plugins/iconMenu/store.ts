/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/iconMenu/store
 */
/* eslint-enable tsdoc/syntax */

import type { FocusMenu, Menu } from './types'

import { toMerged } from 'es-toolkit'
import { t } from 'i18next'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, markRaw, readonly, ref, toRaw } from 'vue'

import { useCoreStore } from '@/core/stores'

import { PluginId } from './types'

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
	const focusMenus = ref<FocusMenu[]>([])
	const open = ref<string | null>(null)
	const focusOpen = ref<string | null>(null)

	const buttonComponent = computed(() =>
		coreStore.configuration.iconMenu?.buttonComponent
			? markRaw(coreStore.configuration.iconMenu.buttonComponent)
			: null
	)

	const layoutTag = computed(
		() => coreStore.configuration.iconMenu?.layoutTag ?? ''
	)

	function isPluginInIconMenu(pluginId: string) {
		const display = coreStore.configuration[pluginId]?.displayComponent
		return typeof display === 'boolean' ? display : true
	}
	function addPlugin(menuGroup: Menu[]) {
		const filteredMenuGroup = menuGroup.filter(({ plugin: { id } }) =>
			isPluginInIconMenu(id)
		)
		filteredMenuGroup.forEach(({ plugin }) => {
			if (plugin.component) {
				markRaw(toRaw(plugin.component))
			}
			coreStore.addPlugin(toMerged(plugin, { independent: false }))
		})
		menus.value.push(filteredMenuGroup)
	}
	function addFocusPlugin(menu: FocusMenu) {
		if (!isPluginInIconMenu(menu.plugin.id)) {
			return
		}
		if (menu.plugin.component) {
			markRaw(toRaw(menu.plugin.component))
		}
		coreStore.addPlugin(toMerged(menu.plugin, { independent: false }))
		focusMenus.value.push(menu)
	}
	function removePlugin(pluginId: string) {
		if (open.value === pluginId) {
			open.value = null
		}
		const pluginIndex = menus.value.findIndex((menuGroup) =>
			menuGroup.some(({ plugin: { id } }) => id === pluginId)
		)
		if (pluginIndex !== -1) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const pluginMenu = menus.value[pluginIndex]!
			const pluginMenuIndex = pluginMenu.findIndex(
				({ plugin: { id } }) => id === pluginId
			)
			pluginMenu.splice(pluginMenuIndex, 1)
			if (pluginMenu.length === 0) {
				menus.value.splice(pluginIndex, 1)
			}
		}

		if (focusOpen.value === pluginId) {
			focusOpen.value = null
		}
		const pluginFocusIndex = focusMenus.value.findIndex(
			({ plugin: { id } }) => id === pluginId
		)
		if (pluginFocusIndex !== -1) {
			focusMenus.value.splice(pluginFocusIndex, 1)
		}
		coreStore.removePlugin(pluginId)
	}

	const visibleMenus = computed(() =>
		menus.value.map((menuGroup) =>
			menuGroup.filter(
				(item) => !coreStore.hasSmallDisplay || !item.disabledOnMobile
			)
		)
	)
	const visibleFocusMenus = computed(() =>
		focusMenus.value
			.flat()
			.filter((item) => !coreStore.hasSmallDisplay || !item.disabledOnMobile)
	)

	function setupPlugin() {
		;(coreStore.configuration.iconMenu?.menus || []).forEach((menuGroup) => {
			addPlugin(menuGroup)
		})
		;(coreStore.configuration.iconMenu?.focusMenus || []).forEach((menu) => {
			addFocusPlugin(menu)
		})

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

	function openMenuById(openId: string | null) {
		const entry = menus.value.flat().find(({ plugin: { id } }) => id === openId)
		if (openId && entry) {
			open.value = openId
			openInMoveHandle(openId)
		} else {
			open.value = null
			coreStore.setMoveHandle(null)
		}
	}

	function openFocusMenuById(openId: string | null) {
		const entry = focusMenus.value.find(({ plugin: { id } }) => id === openId)
		if (openId && entry) {
			focusOpen.value = openId
			openInMoveHandle(openId, true)
		} else {
			focusOpen.value = null
			coreStore.setMoveHandle(null)
		}
	}

	function openInMoveHandle(openId: string, focusMenu = false) {
		const menu = (focusMenu ? focusMenus.value : menus.value.flat()).find(
			({ plugin: { id } }) => id === openId
		)
		if (!menu) {
			console.error(`Menu with id ${openId} could not be found.`)
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
				ns: PluginId,
				plugin: t(($) => $.hints[menu.plugin.id], { ns: PluginId }),
			}),
			component: menu.plugin.component,
			plugin: PluginId,
		})
	}

	return {
		visibleMenus,
		visibleFocusMenus,

		/**
		 * Determines which menu is currently open.
		 *
		 * To change the open menu, use {@link openMenuById}.
		 *
		 * @readonly
		 * @alpha
		 */
		open: readonly(open),

		/**
		 * Determines which focus menu is currently open.
		 *
		 * To change the open focus menu, use {@link openFocusMenuById}.
		 *
		 * @readonly
		 * @alpha
		 */
		focusOpen: readonly(focusOpen),

		buttonComponent,
		openMenuById,
		openFocusMenuById,

		/**
		 * Appends a group of plugins to the icon menu.
		 *
		 * @param menu - The menu item group to add.
		 * @alpha
		 */
		addPlugin,

		/**
		 * Appends a plugin to the icon menu as a focus menu.
		 *
		 * @param menu - The focus menu item to add.
		 * @alpha
		 */
		addFocusPlugin,

		/**
		 * Removes a plugin from the icon menu.
		 *
		 * @param pluginId - The ID of the plugin to remove.
		 * @alpha
		 */
		removePlugin,

		/** @alpha */
		layoutTag,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useIconMenuStore, import.meta.hot))
}
