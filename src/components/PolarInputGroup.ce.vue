<template>
	<fieldset class="kern-fieldset">
		<legend class="kern-label">
			{{ legend }}
		</legend>
		<div class="kern-fieldset__body">
			<slot />
		</div>
	</fieldset>
</template>

<script setup lang="ts">
defineProps<{
	legend: string
}>()
</script>

<style scoped>
.kern-fieldset {
	width: 100%;
}

.kern-fieldset__body {
	width: 100%;
	padding: var(--kern-metric-space-small) 0;
	gap: var(--kern-metric-space-small);
	border-radius: var(--kern-metric-border-radius-default);
	background-color: var(--kern-color-layout-background-hued);
}

.kern-label {
	padding-left: 0.75rem;
}

:deep(.kern-form-check) {
	align-items: center;
	gap: var(--kern-metric-space-large);
	margin-left: 0.75rem;
	padding-right: 0;
}
</style>
