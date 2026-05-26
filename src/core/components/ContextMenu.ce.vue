<template>
	<PolarCard :style="`left: ${left}; top: ${top}`" @pointerdown.stop>
		<section class="kern-card__body">
			<ul>
				<li v-for="{ id, icon, label } in buttons" :key="id">
					<KernButton class="kern-btn--block kern-btn--tertiary" :icon="icon">
						{{ label }}
					</KernButton>
				</li>
			</ul>
		</section>
	</PolarCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import PolarCard from '@/components/PolarCard.ce.vue'
// TODO: Add visual groups
// TODO: Add actions to add and remove buttons from the context menu
const buttons = ref([
	{ id: 'color', icon: 'kern-icon--palette', label: 'Farben anpassen' },
	{ id: 'path', icon: 'kern-icon--rebase-edit', label: 'Pfad anpassen' },
	{
		id: 'duplicate',
		icon: 'kern-icon--content-copy',
		label: 'Duplizieren',
	},
])
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

	&:deep(.kern-card__container) {
		padding: 0;
	}

	button {
		pointer-events: all;
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
