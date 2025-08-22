<template>
	<div v-if="configuration.layout === 'standard'" class="standard-layout">
		<ToastUI />
	</div>
	<ToastUI v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ToastUI from './ToastUI.ce.vue'
import { useCoreStore } from '@/core/stores/export'

const { configuration } = storeToRefs(useCoreStore())
</script>

<style scoped>
.standard-layout {
	position: absolute;
	top: 0;
	left: 25%;
	right: 25%;
}
</style>
