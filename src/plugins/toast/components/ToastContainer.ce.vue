<template>
	<div v-if="layout === 'standard'" class="polar-plugin-toast-standard-layout">
		<ToastUI />
	</div>
	<ToastUI v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ToastUI from './ToastUI.ce.vue'
import { useCoreStore } from '@/core/stores/export'

const { layout } = storeToRefs(useCoreStore())
</script>

<style scoped>
.polar-plugin-toast-standard-layout {
	position: absolute;
	z-index: 40;
	top: 0;
	left: 25%;
	right: 25%;
}
</style>
