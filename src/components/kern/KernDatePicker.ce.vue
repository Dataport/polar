<template>
	<input
		v-model="inputModel"
		type="date"
		class="kern-form-input__input"
		:min="dateToString(props.min ?? null)"
		:max="dateToString(props.max ?? null)"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { dateToString, stringToDate } from '@/lib/dateUtils'

const props = defineProps<{
	min?: Date
	max?: Date
}>()

const model = defineModel<Date | null>({ required: true })

const inputModel = computed({
	get: () => dateToString(model.value),
	set: (value) => {
		model.value = stringToDate(value)
	},
})
</script>
