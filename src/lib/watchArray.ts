import type { WatchOptions, WatchSource } from 'vue'

import { watch } from 'vue'

function getDifference<T>(items: T[], otherItems: T[]) {
	const unmatchedItems = [...otherItems]
	return items.filter((item) => {
		const matchIndex = unmatchedItems.findIndex((otherItem) =>
			Object.is(item, otherItem)
		)
		if (matchIndex === -1) {
			return true
		}
		unmatchedItems.splice(matchIndex, 1)
		return false
	})
}

/**
 * Watches an array and invokes callbacks for every added and removed item.
 *
 * @param source - Reactive array source to watch
 * @param onAdded - Callback invoked for every added item
 * @param onRemoved - Callback invoked for every removed item
 * @param options - Vue watch options
 */
export function watchArray<T>(
	source: WatchSource<T[]>,
	onAdded: (item: T) => void,
	onRemoved: (item: T) => void,
	options?: WatchOptions
) {
	return watch(
		source,
		(newItems, oldItems) => {
			const previousItems = oldItems ?? []
			getDifference(newItems, previousItems).forEach((item) => {
				onAdded(item)
			})
			getDifference(previousItems, newItems).forEach((item) => {
				onRemoved(item)
			})
		},
		options
	)
}

if (import.meta.vitest) {
	const { expect, test, vi } = import.meta.vitest
	const { ref } = await import('vue')

	test('calls the respective callback for each added and removed item', () => {
		const items = ref([{ id: 1 }, { id: 2 }])
		const onAdded = vi.fn()
		const onRemoved = vi.fn()

		watchArray(items, onAdded, onRemoved, { flush: 'sync' })

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const retainedItem = items.value[1]!
		const addedItem = { id: 3 }
		items.value = [retainedItem, addedItem]

		expect(onAdded).toHaveBeenCalledOnce()
		expect(onAdded).toHaveBeenCalledWith(addedItem)
		expect(onRemoved).toHaveBeenCalledOnce()
		expect(onRemoved).toHaveBeenCalledWith({ id: 1 })
	})
}
