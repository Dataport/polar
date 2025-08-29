<template>
	<StandardMenu v-if="layout === 'standard'" />
	<NineRegionsMenu v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import NineRegionsMenu from './NineRegionsMenu.ce.vue'
import StandardMenu from './StandardMenu.ce.vue'
import { useCoreStore } from '@/core/stores/export.ts'

const { layout } = storeToRefs(useCoreStore())
</script>
