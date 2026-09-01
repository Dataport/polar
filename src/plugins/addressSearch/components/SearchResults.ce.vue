<template>
	<PolarResultList
		component-id="address-search"
		:search-results="searchResults"
		:limited-results="limitResults"
		:input-value="inputValue"
		:selected-group-id="selectedGroupId"
		:focus-after-search="addressSearchStore.focusAfterSearch"
		@select-result="selectResult"
	>
		<template #result-count-label="{ count }">
			{{ t(($) => $.resultCount, { count, ns: PluginId }) }}
		</template>
		<template #toggle-label="{ expanded }">
			{{
				t(($) => $.resultList[expanded ? 'reduce' : 'extend'], { ns: PluginId })
			}}
		</template>
	</PolarResultList>
	<component :is="afterResultComponent" v-if="afterResultComponent" />
</template>

<script setup lang="ts">
import { t } from 'i18next'
import { storeToRefs } from 'pinia'

import PolarResultList from '@/components/PolarResultList.ce.vue'

import { useAddressSearchStore } from '../store'
import { PluginId } from '../types'

const addressSearchStore = useAddressSearchStore()
const { selectResult } = addressSearchStore
const {
	afterResultComponent,
	inputValue,
	limitResults,
	selectedGroupId,
	searchResults,
} = storeToRefs(addressSearchStore)
</script>
