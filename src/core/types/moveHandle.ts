import type { Component } from 'vue'

import type { Icon } from './theme'

export interface MoveHandleProperties {
	closeFunction: (...args: unknown[]) => unknown
	closeLabel: string
	component: Component

	/** Id of the plugin that added the moveHandle. */
	plugin: string
	closeIcon?: Icon
}
