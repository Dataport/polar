<template>
	<PolarResultList
		component-id="address-search"
		focus-return-target-id="polar-plugin-address-search-input"
		:search-results="searchResults"
		:limited-results="limitResults"
		:input-value="inputValue"
		:selected-group-id="selectedGroupId"
		:focus-after-search="addressSearchStore.focusAfterSearch"
		@select-result="selectResult"
	/>
	<component :is="afterResultComponent" v-if="afterResultComponent" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import PolarResultList from '@/components/PolarResultList.ce.vue'

import { useAddressSearchStore } from '../store'

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
