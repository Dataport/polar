<template>
	<PolarCard
		:style="`left: ${left}; top: ${top}`"
		@pointerdown.stop
		@keydown.escape="close"
	>
		<section class="kern-card__body" role="menu">
			<KernButton
				v-for="{ id, icon, text, callback } in buttons.values()"
				:key="id"
				class="kern-btn--block kern-btn--tertiary"
				:icon="icon"
				role="menuitem"
				@click="ring(callback)"
			>
				{{ text }}
			</KernButton>
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { toRaw } from 'vue'

import type { ContextMenuEntry } from '@/core'

import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarCard from '@/components/PolarCard.ce.vue'

import { useContextMenuStore } from '../stores/contextMenu'

defineProps<{
	top: string
	left: string
}>()

// TODO(dopenguin): Add visual groups

const contextMenuStore = useContextMenuStore()
const { buttons } = storeToRefs(contextMenuStore)

function ring(callback: ContextMenuEntry['callback']) {
	close()
	callback(toRaw(contextMenuStore.clickCoordinate))
}

function close() {
	contextMenuStore.show = false
}
</script>

<style scoped>
.kern-card {
	position: absolute;
	border-width: 0;
	min-width: 15rem;
	z-index: 3;
	pointer-events: all;

	&:deep(.kern-card__container) {
		padding: 0;
	}

	.kern-card__body {
		gap: 0;

		button {
			justify-content: start;
		}
	}
}
</style>
