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
	// TODO(dopenguin): Implement once MoveHandle is implemented
	/* function openInMoveHandle(index: number) {
		const { hint, plugin } = menus.value[index]
		commit(
			'setMoveHandle',
			{
				closeLabel: t('mobileCloseButton', {
					ns: 'iconMenu',
					plugin: hint || `plugins.iconMenu.hints.${plugin.id}`,
				}),
				closeFunction: () => {
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
		open,
		buttonComponent,
		openMenuById,
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
