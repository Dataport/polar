<template>
	<PolarResultList
		component-id="address-search"
		:search-results="searchResults"
		:after-result-component="afterResultComponent"
		:limited-results="limitResults"
		:input-value="inputValue"
		:result-count-label="resultCountLabel"
		:select-result="selectResult"
		:toggle-label="toggleLabel"
		:selected-group-id="selectedGroupId"
		:focus-after-search="addressSearchStore.focusAfterSearch"
	/>
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

function resultCountLabel(count: number) {
	return t(($) => $.resultCount, {
		count,
		ns: PluginId,
	})
}

function toggleLabel(expanded: boolean) {
	return t(($) => $.resultList[expanded ? 'reduce' : 'extend'], {
		ns: PluginId,
	})
}
</script>
