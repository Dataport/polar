import { FilterConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'

export type LayerId = string
export type TargetProperty = string
export type KnownCategory = string
export type DatePattern = string
export interface TimeLayerEntry {
  targetProperty: TargetProperty
  pattern: DatePattern
  radioId: number
  freeSelection: Date[]
}
export interface TimeOption {
  label: string
  component: Vue | null
  amount: number | null
  unit: 'days'
  now: 'until' | 'from' | null
  type: 'last' | 'next' | 'freeSelection'
}

export interface FilterState {
  category: Record<
    LayerId,
    Record<TargetProperty, Record<KnownCategory, boolean>>
  >
  time: Record<LayerId, TimeLayerEntry>
}

export interface FilterGetters extends FilterState {
  filterConfiguration: FilterConfiguration
  getActiveCategory: ({
    layerId,
    targetProperty,
    knownCategory,
  }: {
    layerId: LayerId
    targetProperty: TargetProperty
    knownCategory: KnownCategory
  }) => boolean
  getActiveCategoryAll: ({
    layerId,
    targetProperty,
  }: {
    layerId: LayerId
    targetProperty: TargetProperty
  }) => boolean | 'indeterminate'
  getActiveTime: ({ layerId }: { layerId: LayerId }) => number
  getCategories: (
    layerId: LayerId
  ) => FilterConfiguration['layers'][string]['categories']
  getTimeConfig: (
    layerId: LayerId
  ) => FilterConfiguration['layers'][string]['time']
  getTimeOptions: (layerId: LayerId) => TimeOption[]
  getFreeSelection: (layerId: LayerId) => TimeLayerEntry['freeSelection']
}
