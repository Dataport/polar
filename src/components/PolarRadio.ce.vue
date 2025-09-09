<template>
	<div class="kern-form-check">
		<input
			:id="`polar-radio-${value}-${idSuffix}`"
			v-model="model"
			class="kern-form-check__radio"
			:name="value"
			:value="value"
			type="radio"
			:disabled="disabled"
		/>
		<label class="kern-label" :for="`polar-radio-${value}-${idSuffix}`">
			{{ label }}
		</label>
	</div>
</template>

<script setup lang="ts">
// TODO(dopenguin): Instead of this being the radio, this may as well be any input that has a singular value as v-model
// TODO(dopenguin): If possible, can the type for defineModel be asserted based on the value of props.value (e.g. 'checkbox' -> string[])?
defineProps<{
	idSuffix: string
	label: string
	value: string
	disabled?: boolean
}>()
const model = defineModel<string>({ required: true })
</script>

<style scoped>
.kern-form-check__radio[disabled] {
	&:hover {
		border: var(--kern-metric-border-width-default) solid
			var(--kern-color-form-input-border);
	}
}
</style>
