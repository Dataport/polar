<template>
	<div class="kern-form-input">
		<label class="kern-label" for="select">Fachdatensatz auswählen</label>
		<div class="kern-form-input__select-wrapper">
			<select v-model="selectModel" class="kern-form-input__select">
				<option v-for="layer of layers" :key="layer" :value="layer">
					{{ coreStore.getLayerConfiguration(layer)?.name ?? 'id' }}
				</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

import { useFilterStore } from '../store'

const model = defineModel<string | null>({ required: true })
const selectModel = computed({
	get: () => model.value || '',
	set: (value) => {
		model.value = value || null
	},
})

const coreStore = useCoreStore()
const filterStore = useFilterStore()
const layers = computed(() => Object.keys(filterStore.configuration.layers))
</script>
