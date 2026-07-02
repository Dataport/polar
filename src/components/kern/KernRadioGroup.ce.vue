<template>
	<div v-for="(item, idx) of items" :key="idx" class="kern-form-check">
		<input
			:id="id + '-' + idx"
			v-model="model"
			class="kern-form-check__radio"
			type="radio"
			:value="item.value"
		/>
		<label :for="id + '-' + idx" class="kern-label">
			{{ item.label }}
		</label>
	</div>
</template>

<script setup lang="ts">
import type { Icon } from '@/core'

import { useId } from 'vue'

defineProps<{
	items: {
		value: string
		label: string
		icon?: Icon | false
	}[]
}>()

const model = defineModel<string>({ required: true })

const id = useId()
</script>

<style scoped>
.kern-form-check {
	box-sizing: border-box;
}
</style>
