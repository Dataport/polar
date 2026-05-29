<template>
	<PolarCard
		:style="`left: ${left}; top: ${top}`"
		@pointerdown.stop
		@keydown.escape="close"
	>
		<section ref="menu" class="kern-card__body" role="menu">
			<KernButton
				v-for="({ id, icon, text, callback }, index) in buttons.values()"
				:key="id"
				ref="menuItems"
				class="kern-btn--block kern-btn--tertiary"
				:icon="icon"
				role="menuitem"
				tabindex="-1"
				@click="ring(callback)"
				@keydown.enter="ring(callback)"
				@keydown.up.prevent.stop="focusNextElement(index, -1)"
				@keydown.down.prevent.stop="focusNextElement(index, 1)"
			>
				{{ text }}
			</KernButton>
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
	type ComponentPublicInstance,
	onMounted,
	toRaw,
	useTemplateRef,
} from 'vue'

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

const menu = useTemplateRef<HTMLElement>('menu')
onMounted(() => {
	;(menu.value as HTMLElement)
		.querySelector<HTMLElement>('[role="menuitem"]')
		?.focus()
})

const menuItems = useTemplateRef<ComponentPublicInstance[]>('menuItems')

function focusNextElement(index: number, direction: -1 | 1) {
	const nextIndex = index + direction
	if (
		!menuItems.value ||
		nextIndex === -1 ||
		nextIndex === menuItems.value.length
	) {
		return
	}
	menuItems.value[nextIndex]?.$el.focus()
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

			&:focus {
				outline: auto;
			}
		}
	}
}
</style>
