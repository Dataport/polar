<template>
	<button
		:id="`polar-layer-chooser-legend-${id}-button`"
		class="kern-btn kern-btn--tertiary"
		:disabled="disabled"
	>
		<span class="kern-icon kern-icon--info" aria-hidden="true" />
		<span class="kern-label kern-sr-only">
			{{ $t(($) => $.legend.open, { ns: PluginId }) }}
		</span>
	</button>
</template>

<script setup lang="ts">
import { PluginId } from '../types'

defineProps<{
	disabled: boolean
	id: string
}>()
</script>
