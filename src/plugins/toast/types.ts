import type { Ref } from 'vue'

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
	severity: ToastSeverity
	text: string | Ref<string>
	theme?: ToastTheme
}

/**
 * Options for adding a toast.
 */
export interface ToastOptions {
	timeout?: number | null
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
