import type { Color, Icon, PluginOptions } from '@/core'

/**
 * Plugin identifier.
 */
export const PluginId = 'toast'

/**
 * Toast severity.
 */
export type ToastSeverity = 'error' | 'warning' | 'info' | 'success'

/**
 * Customized toast theme.
 */
export interface ToastTheme {
	color?: Color
	icon?: Icon
}

/**
 * Toast.
 */
export interface Toast {
	text: string
	severity: ToastSeverity
	theme?: ToastTheme
}

/**
 * Plugin options for toast plugin.
 */
export interface ToastPluginOptions extends PluginOptions {
	error?: ToastTheme
	info?: ToastTheme
	success?: ToastTheme
	warning?: ToastTheme
}
