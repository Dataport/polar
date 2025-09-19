<template>
	<div class="kern-form-check">
		<input
			:id="`polar-${type}-${value}-${idSuffix}`"
			v-model="model"
			:class="`kern-form-check__${type}`"
			:name="value"
			:value="value"
			:type="type"
			:disabled="disabled"
		/>
		<label class="kern-label" :for="`polar-${type}-${value}-${idSuffix}`">
			{{ label }}
		</label>
	</div>
</template>

<script setup lang="ts" generic="T extends 'checkbox' | 'radio'">
// NOTE: It is fine here that props is only used as a type in the script.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
	idSuffix: string
	label: string
	type: T
	value: string
	disabled?: boolean
}>()
const model = defineModel<
	typeof props.type extends 'checkbox' ? string[] : string
>({ required: true })
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
		margin: 0.25rem;
	}
}
</style>
