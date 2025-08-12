import type { Component } from 'vue'
import type { PluginContainer, PluginOptions } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = '@polar/polar/plugins/iconMenu'

export interface Menu {
	id: string
	plugin: PluginContainer
	// Locale string; if not given `plugins.iconMenu.hints.${id}` is used
	hint?: string
	icon?: string
}

/**
 * Plugin options for iconMenu plugin.
 */
export interface IconMenuPluginOptions extends PluginOptions {
	menus: Menu[]
	buttonComponent?: Component
	initiallyOpen?: string
}
