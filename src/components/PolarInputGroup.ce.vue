<template>
	<fieldset class="kern-fieldset">
		<legend class="kern-label">
			{{ $t(legend, legendOptions) }}
		</legend>
		<div class="kern-fieldset__body">
			<slot />
		</div>
	</fieldset>
</template>
<script setup lang="ts">
import { type TOptions } from 'i18next'

defineProps<{
	legend: string
	legendOptions?: TOptions
}>()
</script>

<style scoped>
.kern-label {
	padding-left: 0.75rem;
}

:deep(.kern-form-check) {
	align-items: center;
	gap: var(--kern-metric-space-large, 1.5rem);
	margin-left: 0.75rem;
	padding-right: 0;
}
</style>
