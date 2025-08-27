<template>
	<template v-if="configuration.layout === 'standard'">
		<StandardMenu />
		<TopRightMenu />
	</template>
	<NineRegionsMenu v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import NineRegionsMenu from './NineRegionsMenu.ce.vue'
import StandardMenu from './StandardMenu.ce.vue'
import TopRightMenu from './TopRightMenu.ce.vue'
import { useCoreStore } from '@/core/stores/export.ts'

const { configuration } = storeToRefs(useCoreStore())
</script>

<style scoped></style>
