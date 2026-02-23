<template>
	<div class="range-picker">
		<KernDatePicker v-model="start" v-bind="props" />
		–
		<KernDatePicker v-model="end" v-bind="props" />
	</div>
</template>

<script setup lang="ts">
import KernDatePicker from './KernDatePicker.ce.vue'

const props = defineProps<{
	min?: Date
	max?: Date
}>()

const start = defineModel<Date | null>('start', { required: true })
const end = defineModel<Date | null>('end', { required: true })
</script>

<style scoped>
.range-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0.3em 0;
}
</style>
