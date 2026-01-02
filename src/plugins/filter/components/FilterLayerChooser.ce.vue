<template>
	<div class="kern-form-input">
		<label class="kern-label" for="select">Fachdatensatz auswählen</label>
		<div class="kern-form-input__select-wrapper">
			<select v-model="model" class="kern-form-input__select">
				<option v-for="layer of layers" :key="layer">{{ layer }}</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFilterStore } from '../store'

const model = defineModel<string>({ required: true })

const filterStore = useFilterStore()
const layers = computed(() => Object.keys(filterStore.configuration.layers))
</script>
