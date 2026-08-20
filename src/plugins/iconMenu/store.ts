/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/iconMenu/store
 */
/* eslint-enable tsdoc/syntax */

import type { Component } from 'vue'
import type { Icon } from '@/core'
import type { IconMenuPluginOptions, Menu } from './types'

import { toMerged } from 'es-toolkit'
import { t } from 'i18next'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, markRaw, ref, toRaw } from 'vue'

import { useSpaceDetector } from '@/composables/spaceDetector'
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

	const configuration = computed(
		() => coreStore.configuration[PluginId] as IconMenuPluginOptions
	)

	const menus = ref<Array<Menu[]>>([])
	const focusMenus = ref<(Menu & { icon: Icon })[]>([])
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

	const { spaceDirection } = useSpaceDetector(configuration)

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
		// Components are marked raw so they themselves are not made reactive
		menus.value = (coreStore.configuration.iconMenu?.menus || []).map(
			(menuGroup) =>
				menuGroup
					.filter(({ plugin: { id } }) => {
						const display = coreStore.configuration[id]?.displayComponent
						return typeof display === 'boolean' ? display : true
					})
					.map((menuItem) => ({
						...menuItem,
						plugin: {
							...menuItem.plugin,
							component: markRaw(toRaw(menuItem.plugin.component as Component)),
						},
					}))
		)
		focusMenus.value = (coreStore.configuration.iconMenu?.focusMenus || [])
			.filter(({ plugin: { id } }) => {
				const display = coreStore.configuration[id]?.displayComponent
				return typeof display === 'boolean' ? display : true
			})
			.map((menuItem) => ({
				...menuItem,
				plugin: {
					...menuItem.plugin,
					component: markRaw(toRaw(menuItem.plugin.component as Component)),
				},
			}))

		menus.value
			.concat(focusMenus.value)
			.flat()
			.forEach(({ plugin }) => {
				coreStore.addPlugin(toMerged(plugin, { independent: false }))
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
		open,
		focusOpen,
		buttonComponent,
		openInMoveHandle,
		openMenuById,
		openFocusMenuById,

		/** @alpha */
		layoutTag,

		/** @internal */
		spaceDirection,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useIconMenuStore, import.meta.hot))
}
