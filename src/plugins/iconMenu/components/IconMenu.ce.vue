<template>
	<StandardMenu v-if="layout === 'standard'" />
	<NineRegionsMenu v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useCoreStore } from '@/core/stores'

import NineRegionsMenu from './NineRegionsMenu.ce.vue'
import StandardMenu from './StandardMenu.ce.vue'

const { layout } = storeToRefs(useCoreStore())
</script>
