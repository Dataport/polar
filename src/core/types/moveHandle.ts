import type { TOptions } from 'i18next'
import type { Component } from 'vue'

export interface MoveHandleProperties {
	closeFunction: (...args: unknown[]) => unknown
	closeLabel: string
	component: Component
	/** Id of the plugin that added the moveHandle. */
	plugin: string
	closeIcon?: string
}
