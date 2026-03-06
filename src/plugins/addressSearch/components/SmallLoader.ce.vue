<template>
	<div class="kern-loader kern-loader--visible" role="status">
		<span class="kern-sr-only">
			{{ $t(($) => $.hint.loading, { ns: PluginId }) }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { PluginId } from '../types'
</script>

<style scoped>
.kern-loader {
	width: var(--kern-metric-dimension-large);
	height: var(--kern-metric-dimension-large);
	margin: var(--kern-metric-space-small);
	&::before,
	&::after {
		display: none;
	}
}
</style>
