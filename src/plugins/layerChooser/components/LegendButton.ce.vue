<template>
	<KernButton
		:id="`polar-layer-chooser-legend-${id}-button`"
		class="kern-btn--tertiary"
		icon="kern-icon--info"
		:label-sr-only="true"
	>
		{{ $t(($) => $.legend.open, { ns: PluginId }) }}
	</KernButton>
</template>

<script setup lang="ts">
import KernButton from '@/components/kern/KernButton.ce.vue'

import { PluginId } from '../types'

defineProps<{
	id: string
}>()
</script>
