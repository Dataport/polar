<template>
	<template v-for="item of props.items" :key="item.value">
		<input
			:id="id + '*' + item.value"
			v-model="model"
			type="radio"
			:name="id"
			:value="item.value"
		/>
		<label
			:for="id + '*' + item.value"
			class="kern-btn kern-btn--block kern-btn--tertiary"
		>
			<span
				v-if="item.icon"
				:class="{ 'kern-icon': true, [item.icon]: true }"
				aria-hidden="true"
			/>
			<span class="kern-label">{{ item.label }}</span>
		</label>
	</template>
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

<style scoped>
.kern-btn--tertiary {
	background-color: #edf1fa;
	justify-content: left;

	.kern-label {
		text-decoration: none;
	}
}

label {
	border: var(--kern-metric-border-width-default) solid transparent;
}

input[type='radio'] {
	display: none;

	&:checked + label {
		border-color: var(--kern-color-action-default);
	}
}
</style>
