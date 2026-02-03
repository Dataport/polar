<template>
	<section class="polar-filter-section">
		<h3 class="kern-heading-small">
			{{ $t(($) => $.time.header, { ns: PluginId }) }}
		</h3>
		<div class="polar-filter-category-values">
			<KernBlockButtonRadioGroup v-model="model" :items="items" />
		</div>
		<KernDateRangePicker
			v-if="model === 'custom'"
			v-model:start="customModelStart"
			v-model:end="customModelEnd"
			v-bind="timeConstraints"
		/>
	</section>
</template>

<script setup lang="ts">
import { t } from 'i18next'
import { computed, ref } from 'vue'

import type { Icon } from '@/core'

import KernBlockButtonRadioGroup from '@/components/kern/KernBlockButtonRadioGroup.ce.vue'
import KernDateRangePicker from '@/components/kern/KernDateRangePicker.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useFilterStore } from '../store'
import { PluginId } from '../types'

const minDate = new Date(-8640000000000000)
const maxDate = new Date(8640000000000000)

const coreStore = useCoreStore()
const filterStore = useFilterStore()
const targetProperty = computed(
	() => filterStore.selectedLayerConfiguration.time?.targetProperty || ''
)
const pattern = computed(
	() => filterStore.selectedLayerConfiguration.time?.pattern || 'YYYY-MM-DD'
)
const timeState = computed(
	() =>
		filterStore.selectedLayerState.timeSpan?.[targetProperty.value] ?? {
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
		const layerState = filterStore.selectedLayerState
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
		const layerState = filterStore.selectedLayerState
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
const model = computed<'all' | 'custom' | `last-${string}` | `next-${string}`>({
	get: () => {
		if (isCustom.value) {
			return 'custom'
		}
		if (customModelStart.value === null && customModelEnd.value === null) {
			return 'all'
		}
		if (customModelStart.value && customModelEnd.value) {
			for (const offset of filterStore.selectedLayerConfiguration.time?.last ||
				[]) {
				if (
					checkDate(0, customModelEnd.value) &&
					checkDate(-offset, customModelStart.value)
				) {
					return `last-${offset}` as `last-${string}`
				}
			}
			for (const offset of filterStore.selectedLayerConfiguration.time?.next ||
				[]) {
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
		})[filterStore.selectedLayerConfiguration.time?.freeSelection || ''] || {}
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
		...(filterStore.selectedLayerConfiguration.time?.last?.map((offset) => ({
			value: `last-${offset}`,
			label: t(($) => $.time.last, { ns: PluginId, count: offset }),
			icon: 'kern-icon--history' as Icon,
		})) || []),
		...(filterStore.selectedLayerConfiguration.time?.next?.map((offset) => ({
			value: `next-${offset}`,
			label: t(($) => $.time.next, { ns: PluginId, count: offset }),
			icon: 'kern-icon--timeline' as Icon,
		})) || []),
		...(filterStore.selectedLayerConfiguration.time?.freeSelection
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
</script>
