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

<script setup lang="ts">
defineProps<{
	idSuffix: string
	label: string
	type: 'checkbox' | 'radio'
	value: string
	disabled?: boolean
}>()
const model = defineModel<string | string[]>({ required: true })
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
