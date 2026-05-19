<template>
	<div class="kern-form-check">
		<input
			:id="id"
			v-model="model"
			class="kern-form-check__checkbox"
			type="checkbox"
			@keydown.prevent.enter="model = !model"
		/>
		<label :for="id" class="kern-label"><slot /></label>
	</div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<boolean>({ required: true })

const id = useId()
</script>

<style scoped>
.kern-form-check {
	box-sizing: border-box;
}
</style>
