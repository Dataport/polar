<template>
	<h1 class="kern-heading-display">Eisberg-Register</h1>
	<h2 class="kern-heading-large">Nicht genehmigten Eisberg melden</h2>
	<main :class="$style.main">
		<div v-if="view !== 'menu'" style="margin-bottom: 2em">
			<a href="#" class="kern-link" @click.prevent="view = 'menu'">
				<span class="kern-icon kern-icon--arrow-back" aria-hidden="true" />
				Zurück zur Übersicht
			</a>
		</div>
		<TaskMenu
			v-if="view === 'menu'"
			:config-tasks="configTasks"
			@select="view = $event"
		/>
		<IcebergMap v-else-if="view === 'map'" />
		<component :is="configTaskComponent" v-else-if="configTaskComponent" />
		<div
			v-if="view !== 'menu'"
			style="display: flex; gap: 2em; margin-top: 2em"
		>
			<button
				v-if="viewIndex > 1"
				class="kern-btn kern-btn--secondary"
				style="flex: 1"
				@click="viewIndex = viewIndex - 1"
			>
				<span class="kern-icon kern-icon--arrow-back" aria-hidden="true" />
				<span class="kern-label">Zurück</span>
			</button>
			<button
				v-if="viewIndex <= configTasks.length"
				class="kern-btn kern-btn--primary"
				style="flex: 1"
				@click="viewIndex = viewIndex + 1"
			>
				<span class="kern-label">Weiter</span>
				<span class="kern-icon kern-icon--arrow-forward" aria-hidden="true" />
			</button>
		</div>
	</main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import kernExtraIcons from 'virtual:kern-extra-icons'
import LayoutChooser from './components/LayoutChooser.vue'
import TaskMenu from './components/TaskMenu.vue'
import IcebergMap from './components/IcebergMap.vue'

const configTasks = [
	{
		id: 'choose-layout',
		label: 'Layout wählen',
		component: LayoutChooser,
	},
]
const tasks = computed(() => [
	'menu',
	...configTasks.map(({ id }) => id),
	'map',
])

const view = ref('menu')
const viewIndex = computed({
	get: () => tasks.value.indexOf(view.value),
	set: (value) => {
		view.value = tasks.value[value] || 'menu'
	},
})

const configTaskComponent = computed(
	() => configTasks.find((task) => task.id === view.value)?.component
)

document.adoptedStyleSheets.push(kernExtraIcons)
if (import.meta.hot) {
	import.meta.hot.on('kern-extra-icons', ({ icons }) => {
		icons.forEach((icon) => kernExtraIcons.insertRule(icon))
	})
}
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
@import url('@kern-ux/native/dist/kern.css');
@import url('@kern-ux/native/dist/fonts/fira-sans.css');
</style>

<style scoped>
.kern-link {
	color: blue !important;
	& > .kern-icon {
		background-color: blue !important;
	}
}
</style>

<style module>
.main {
	position: relative;
	margin: 2em 4em;

	@media (max-width: 65em) {
		margin: 1.5em 0.5em;
	}
}
</style>
