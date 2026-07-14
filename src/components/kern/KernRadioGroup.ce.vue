<template>
	<div v-for="(item, index) of items" :key="index" class="kern-form-check">
		<input
			:id="id + '-' + index"
			v-model="model"
			class="kern-form-check__radio"
			type="radio"
			:value="item.value"
		/>
		<label :for="id + '-' + index" class="kern-label">
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
