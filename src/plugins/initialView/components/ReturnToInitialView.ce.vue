<template>
	<button
		class="kern-btn kern-btn--icon"
		:title="$t(($) => $.label.return, { ns: PluginId })"
		@click="onClick"
	>
		<span class="kern-icon kern-icon--home" aria-hidden="true" />
		<span class="kern-label">
			{{ $t(($) => $.label.return, { ns: PluginId }) }}
		</span>
	</button>
</template>

<script setup lang="ts">
import { useInitialViewStore } from '../store'
import { PluginId } from '../types'

const returnToInitialViewStore = useInitialViewStore()

function onClick() {
	returnToInitialViewStore.returnToInitialView()
}
</script>

<style scoped>
.kern-btn {
	display: flex;
	align-items: center;
	gap: 0.5em;
}
</style>
