<template>
	<StandardLayoutAttributions v-if="layout === 'standard'" />
	<NineLayoutAttributions v-else />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useCoreStore } from '@/core/stores'

import NineLayoutAttributions from './NineLayoutAttributions.ce.vue'
import StandardLayoutAttributions from './StandardLayoutAttributions.ce.vue'

const { layout } = storeToRefs(useCoreStore())
</script>
