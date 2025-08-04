<template>
	<div class="polar-ui">
		<component :is="NineLayout" />
	</div>
</template>

<script lang="ts" setup>
import NineLayout from './layouts/NineLayout.ce.vue'

// TODO: Use this implementation once the SidebarLayout is implemented
/* const { hasWindowSize } = storeToRefs(useCoreStore())
const layout = computed(() =>
	hasWindowSize.value ? SidebarLayout : NineLayout
) */
</script>

<style lang="scss" scoped>
.polar-ui {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	pointer-events: none;

	width: 100%;
	height: 100%;
}
</style>
