<template>
	<div class="kern-task-list">
		<div class="kern-task-list__header">
			<h2 class="kern-heading-medium">Karte konfigurieren</h2>
		</div>
		<ul class="kern-task-list__list">
			<li
				v-for="(task, idx) of configTasks"
				:key="idx"
				class="kern-task-list__item"
			>
				<span class="kern-number">{{ idx + 1 }}</span>
				<div :id="`task${idx + 1}-title`" class="kern-task-list__title">
					<a
						href="#"
						class="kern-link kern-link--stretched"
						@click.prevent="emit('select', task.id)"
					>
						{{ task.label }}
					</a>
				</div>
			</li>
		</ul>
		<div class="kern-task-list__header">
			<h2 class="kern-heading-medium">Eisberg-Meldung</h2>
		</div>
		<ul class="kern-task-list__list">
			<li class="kern-task-list__item">
				<span class="kern-number">{{ props.configTasks.length + 1 }}</span>
				<div :id="`task-map-title`" class="kern-task-list__title">
					<a
						href="#"
						class="kern-link kern-link--stretched"
						@click="emit('select', 'map')"
					>
						Karte anzeigen
					</a>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	configTasks: {
		id: string
		label: string
	}[]
}>()

const emit = defineEmits<{
	select: [string]
}>()
</script>
