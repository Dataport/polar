<template>
	<NineRegionsResults v-if="featuresAvailable" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAddressSearchStore } from '../store'
import NineRegionsResults from './NineRegionsResults.ce.vue'

const { featuresAvailable } = storeToRefs(useAddressSearchStore())
</script>
