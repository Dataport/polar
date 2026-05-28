<template>
	<PolarCard :style="`left: ${left}; top: ${top}`" @pointerdown.stop>
		<section class="kern-card__body">
			<ul>
				<li v-for="{ id, icon, text, callback } in buttons.values()" :key="id">
					<KernButton
						class="kern-btn--block kern-btn--tertiary"
						:icon="icon"
						@click="ring(callback)"
					>
						{{ text }}
					</KernButton>
				</li>
			</ul>
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

// TODO(dopenguin): Add visual groups

const contextMenuStore = useContextMenuStore()
const { buttons } = storeToRefs(contextMenuStore)

function ring(callback: ContextMenuEntry['callback']) {
	contextMenuStore.show = false
	callback(toRaw(contextMenuStore.clickCoordinate))
}

defineProps<{
	top: string
	left: string
}>()
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

	button {
		justify-content: start;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}
}
</style>
