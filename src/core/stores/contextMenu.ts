import type { Coordinate } from 'ol/coordinate'
import type { ContextMenuEntry } from '../types'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContextMenuStore = defineStore('contextMenu', () => {
	const buttons = ref(new Map<string, ContextMenuEntry>())
	const clickCoordinate = ref<Coordinate>([])
	const show = ref(false)

	function addEntry(entry: ContextMenuEntry) {
		if (buttons.value.has(entry.id)) {
			console.warn(
				`context menu already has an entry with id '${entry.id}'. The entry will be updated.`
			)
		}
		buttons.value.set(entry.id, entry)
	}

	function removeEntry(id: string) {
		buttons.value.delete(id)
	}

	return {
		/** @internal */
		buttons,

		/** @internal */
		clickCoordinate,

		/** @internal */
		show,

		/** @internal */
		addEntry,

		/** @internal */
		removeEntry,
	}
})
