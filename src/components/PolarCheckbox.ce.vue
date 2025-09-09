<template>
	<div class="kern-form-check">
		<input
			:id="`polar-checkbox-${value}-${idSuffix}`"
			v-model="model"
			class="kern-form-check__checkbox"
			:name="value"
			:value="value"
			type="checkbox"
			:disabled="disabled"
		/>
		<label class="kern-label" :for="`polar-checkbox-${value}-${idSuffix}`">
			{{ label }}
		</label>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	idSuffix: string
	label: string
	value: string
	disabled?: boolean
}>()

const model = defineModel<string[]>({ required: true })
</script>

<style scoped>
.kern-form-check__checkbox[disabled] {
	&:hover {
		border: var(--kern-metric-border-width-default) solid
			var(--kern-color-form-input-border);
	}

	&:checked:hover::before {
		margin: 4px;
	}
}
</style>
