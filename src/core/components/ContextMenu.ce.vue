<template>
	<PolarCard
		:style="`left: ${left}; top: ${top}`"
		@pointerdown.stop
		@keydown.escape="close"
	>
		<section ref="menu" class="kern-card__body" role="menu">
			<template
				v-for="(group, groupId, index) of buttonsByGroup"
				:key="groupId"
			>
				<KernButton
					v-for="{ id, icon, text, textNs, callback, color } in group"
					:key="id"
					ref="menuItems"
					class="kern-btn--block kern-btn--tertiary"
					:icon="icon"
					role="menuitem"
					tabindex="-1"
					:style="{ '--kern-btn-text-color': color }"
					@click="ring(callback)"
					@keydown.enter="ring(callback)"
					@keydown.up.prevent.stop="focusNextElement($event, -1)"
					@keydown.down.prevent.stop="focusNextElement($event, 1)"
				>
					{{ translate(text, textNs) }}
				</KernButton>
				<hr v-if="index < Object.keys(buttonsByGroup).length - 1" />
			</template>
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { ContextMenuEntry } from '@/core'

import { t } from 'i18next'
import { computed, onMounted, toRaw, useTemplateRef } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarCard from '@/components/PolarCard.ce.vue'

import { useContextMenuStore } from '../stores/contextMenu'

defineProps<{
	top: string
	left: string
}>()

const contextMenuStore = useContextMenuStore()

const buttonsByGroup = computed(() =>
	Object.groupBy(
		contextMenuStore.buttons.values().toArray(),
		({ group }) => group ?? 'default'
	)
)

function translate(text: string, textNs?: string): string {
	// @ts-expect-error | Locale keys are dynamic.
	return t(text, { ns: textNs })
}

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

function focusNextElement(event: KeyboardEvent, direction: -1 | 1) {
	const { target } = event
	const items = menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]')
	if (!items || target === null) {
		console.warn('Could not focus any element.')
		return
	}
	const index = [...items].indexOf(target as HTMLElement)
	const nextElement = items[(index + direction) % items.length]
	if (nextElement) {
		nextElement.focus()
	}
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

		hr {
			height: var(--kern-metric-border-width-light, 0.0625rem);
			width: 100%;
			margin: 0;
			color: var(--kern-color-layout-border);
		}
	}
}
</style>
