<template>
	<div v-for="item of props.items" :key="item.value" class="kern-form-check">
		<input
			:id="id + '*' + item.value"
			v-model="model"
			class="kern-form-check__radio"
			type="radio"
			:value="item.value"
		/>
		<label :for="id + '*' + item.value" class="kern-label">
			{{ item.label }}
		</label>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

import type { Icon } from '@/core'

const props = defineProps<{
	items: {
		value: string
		label: string
		icon?: Icon | false
	}[]
}>()

const model = defineModel<string>({ required: true })

const id = useId()
</script>
