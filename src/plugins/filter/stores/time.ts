import type { Time } from '../types'

import { t } from 'i18next'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useCoreStore } from '@/core/stores'

import { PluginId } from '../types'
import { useFilterMainStore } from './main'

type TimeModel = 'all' | 'custom' | `last-${string}` | `next-${string}`

export const useFilterTimeStore = defineStore('plugins/filter/time', () => {
	const minDate = new Date(-8640000000000000)
	const maxDate = new Date(8640000000000000)

	const coreStore = useCoreStore()
	const filterMainStore = useFilterMainStore()

	const configuration = computed(
		() => filterMainStore.selectedLayerConfiguration.time || ({} as Time)
	)

	const targetProperty = computed(
		() => configuration.value.targetProperty || ''
	)
	const pattern = computed(() => configuration.value.pattern || 'YYYY-MM-DD')

	const model = ref<TimeModel>('all')
	const customModelStart = ref<Date | null>(null)
	const customModelEnd = ref<Date | null>(null)

	/** Reset time filter selection when the active layer changes. */
	watch(
		() => filterMainStore.selectedLayerId,
		() => {
			model.value = 'all'
			customModelStart.value = null
			customModelEnd.value = null
		}
	)

	watch(
		[model, customModelStart, customModelEnd],
		([value, start, end]) => {
			const layerState = filterMainStore.selectedLayerState
			if (!layerState || !targetProperty.value) {
				return
			}
			layerState.timeSpan ??= {}

			const now = new Date()
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
			let from: Date
			let until: Date

			if (value === 'all') {
				from = minDate
				until = maxDate
			} else if (value === 'custom') {
				from = start || minDate
				until = end
					? new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1)
					: maxDate
			} else if (value.startsWith('last-')) {
				const offset = Number(value.substring(5))
				from = new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() - offset
				)
				until = new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + 1
				)
			} else {
				const offset = Number(value.substring(5))
				from = today
				until = new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + offset + 1
				)
			}

			layerState.timeSpan[targetProperty.value] = {
				from,
				until,
				pattern: pattern.value,
			}
		},
		{ immediate: true }
	)

	const timeConstraints = computed(
		() =>
			({
				from: {
					min: new Date(),
				},
				until: {
					max: new Date(),
				},
			})[
				filterMainStore.selectedLayerConfiguration.time?.freeSelection || ''
			] || {}
	)

	const items = computed(() => {
		// This reactive value needs to recompute on language changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		coreStore.language

		return [
			{
				value: 'all',
				label: t(($) => $.time.noRestriction, { ns: PluginId }),
			},
			...(configuration.value.last?.map((offset) => ({
				value: `last-${offset}`,
				label: t(($) => $.time.last, { count: offset, ns: PluginId }),
			})) || []),
			...(configuration.value.next?.map((offset) => ({
				value: `next-${offset}`,
				label: t(($) => $.time.next, { count: offset, ns: PluginId }),
			})) || []),
			...(configuration.value.freeSelection
				? [
						{
							value: 'custom',
							label: t(($) => $.time.chooseTimeFrame, { ns: PluginId }),
						},
					]
				: []),
		]
	})

	return {
		model,
		customModelStart,
		customModelEnd,
		timeConstraints,
		items,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFilterTimeStore, import.meta.hot))
}
