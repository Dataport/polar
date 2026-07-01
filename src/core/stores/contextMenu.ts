import type { Coordinate } from 'ol/coordinate'
import type { ContextMenuEntry } from '../types'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useMainStore } from './main'

export const useContextMenuStore = defineStore('contextMenu', () => {
	const mainStore = useMainStore()

	const buttons = ref(new Map<string, ContextMenuEntry>())
	const clickCoordinate = ref<Coordinate>([])
	const show = ref(false)

	const left = ref('0')
	const top = ref('0')

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

	function open(e: MouseEvent, mapBoundingRect: DOMRect) {
		// Suppresses the context menu of the browser
		e.preventDefault()
		e.stopImmediatePropagation()
		show.value = true
		const leftPosition = e.clientX - mapBoundingRect.left
		const topPosition = e.clientY - mapBoundingRect.top
		clickCoordinate.value = mainStore.map.getCoordinateFromPixel([
			leftPosition,
			topPosition,
		])

		left.value = `${leftPosition}px`
		top.value = `${topPosition}px`
	}

	function dismiss() {
		show.value = false
	}

	return {
		/** @internal */
		buttons,

		/** @internal */
		clickCoordinate,

		/** @internal */
		show,

		/** @internal */
		top,

		/** @internal */
		left,

		/** @internal */
		addEntry,

		/** @internal */
		removeEntry,

		/** @internal */
		open,

		/** @internal */
		dismiss,
	}
})
