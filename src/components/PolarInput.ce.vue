<template>
	<div class="kern-form-check">
		<input
			:id="id"
			v-model="model"
			:class="`polar-input kern-form-check__${type}`"
			:name="name"
			:value="value"
			:type="type"
			:disabled
		/>
		<label class="polar-input kern-label" :for="id">
			<slot />
		</label>
	</div>
</template>

<script setup lang="ts" generic="T extends 'checkbox' | 'radio'">
import { useId } from 'vue'

// NOTE: It is fine here that props is only used as a type in the script.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	name: string
	type: T
	value: string
	disabled?: boolean
}>()
const model = defineModel<
	typeof props.type extends 'checkbox' ? string[] : string
>({ required: true })
const id = useId()
</script>

<style scoped>
.kern-form-check__radio[disabled],
.kern-form-check__checkbox[disabled] {
	&:hover {
		border: var(--kern-metric-border-width-default) solid
			var(--kern-color-form-input-border);
	}
}

.kern-form-check__checkbox[disabled] {
	&:checked:hover::before {
		margin: var(--kern-metric-space-x-small);
	}
}
</style>
