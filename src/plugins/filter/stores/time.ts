import { t } from 'i18next'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Icon } from '@/core'

import { useCoreStore } from '@/core/stores'

import { PluginId, type Time } from '../types'
import { useFilterMainStore } from './main'

export const useFilterTimeStore = defineStore('plugins/filter/time', () => {
	const minDate = new Date(-8640000000000000)
	const maxDate = new Date(8640000000000000)

	const coreStore = useCoreStore()
	const filterMainStore = useFilterMainStore()

	const configuration = computed(
		() => filterMainStore.selectedLayerConfiguration.time || ({} as Time)
	)
	const state = computed(
		() => filterMainStore.selectedLayerState?.timeSpan || null
	)

	const targetProperty = computed(
		() => configuration.value.targetProperty || ''
	)
	const pattern = computed(() => configuration.value.pattern || 'YYYY-MM-DD')
	const timeState = computed(
		() =>
			state.value?.[targetProperty.value] ?? {
				from: minDate,
				until: maxDate,
				pattern: pattern.value,
			}
	)

	const customModelStart = computed({
		get: () =>
			timeState.value.from.getTime() === minDate.getTime()
				? null
				: timeState.value.from,
		set: (value) => {
			if (!filterMainStore.selectedLayerState) {
				return
			}
			const layerState = filterMainStore.selectedLayerState
			const spanState = (layerState.timeSpan ??= {})
			const propState = (spanState[targetProperty.value] ??= {
				from: minDate,
				until: maxDate,
				pattern: pattern.value,
			})
			propState.from = value || minDate
		},
	})
	const customModelEnd = computed({
		get: () => {
			if (timeState.value.until.getTime() === maxDate.getTime()) {
				return null
			}
			const value = new Date(timeState.value.until)
			value.setDate(value.getDate() - 1)
			return value
		},
		set: (value) => {
			if (!filterMainStore.selectedLayerState) {
				return
			}
			const layerState = filterMainStore.selectedLayerState
			const spanState = (layerState.timeSpan ??= {})
			const propState = (spanState[targetProperty.value] ??= {
				from: minDate,
				until: maxDate,
				pattern: pattern.value,
			})
			if (value === null) {
				propState.until = maxDate
				return
			}
			const newValue = new Date(value)
			newValue.setDate(newValue.getDate() + 1)
			propState.until = newValue
		},
	})

	function checkDate(offset: number, date: Date) {
		const referenceDate = new Date()
		referenceDate.setDate(referenceDate.getDate() + offset)
		return date.toDateString() === referenceDate.toDateString()
	}

	const isCustom = ref(false)
	const model = computed<
		'all' | 'custom' | `last-${string}` | `next-${string}`
	>({
		get: () => {
			if (isCustom.value) {
				return 'custom'
			}
			if (customModelStart.value === null && customModelEnd.value === null) {
				return 'all'
			}
			if (customModelStart.value && customModelEnd.value) {
				for (const offset of filterMainStore.selectedLayerConfiguration.time
					?.last || []) {
					if (
						checkDate(0, customModelEnd.value) &&
						checkDate(-offset, customModelStart.value)
					) {
						return `last-${offset}` as `last-${string}`
					}
				}
				for (const offset of filterMainStore.selectedLayerConfiguration.time
					?.next || []) {
					if (
						checkDate(0, customModelStart.value) &&
						checkDate(offset, customModelEnd.value)
					) {
						return `next-${offset}` as `next-${string}`
					}
				}
			}
			return 'custom'
		},
		set: (value) => {
			if (value === 'all' || value === 'custom') {
				customModelStart.value = null
				customModelEnd.value = null
			} else if (value.startsWith('last-')) {
				const offset = Number(value.substring(5))
				const now = new Date()
				const from = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - offset
				)
				const until = new Date(now.getFullYear(), now.getMonth(), now.getDate())
				customModelStart.value = from
				customModelEnd.value = until
			} else if (value.startsWith('next-')) {
				const offset = Number(value.substring(5))
				const now = new Date()
				const from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
				const until = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() + offset
				)
				until.setDate(until.getDate() + offset)
				customModelStart.value = from
				customModelEnd.value = until
			}
			isCustom.value = value === 'custom'
		},
	})

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
				icon: 'kern-icon--all-inclusive',
			},
			...(configuration.value.last?.map((offset) => ({
				value: `last-${offset}`,
				label: t(($) => $.time.last, { ns: PluginId, count: offset }),
				icon: 'kern-icon--history' as Icon,
			})) || []),
			...(configuration.value.next?.map((offset) => ({
				value: `next-${offset}`,
				label: t(($) => $.time.next, { ns: PluginId, count: offset }),
				icon: 'kern-icon--timeline' as Icon,
			})) || []),
			...(configuration.value.freeSelection
				? [
						{
							value: 'custom',
							label: t(($) => $.time.chooseTimeFrame, { ns: PluginId }),
							icon: 'kern-icon--calendar-month' as Icon,
						},
					]
				: []),
		] satisfies { value: string; label: string; icon: Icon }[]
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
