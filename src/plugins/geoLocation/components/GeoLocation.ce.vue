<template>
	<PolarIconButton
		:hint="$t(($) => $.button.tooltip, { ns: PluginId })"
		:icon="icon"
		:tooltip-position="tooltipPosition"
		:disabled="state === 'DISABLED'"
		@click="geoLocationStore.locate"
	/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useGeoLocationStore } from '../store'
import { PluginId } from '../types'

const coreStore = useCoreStore()
const iconMenuStore = coreStore.getPluginStore('iconMenu')
const { layout } = storeToRefs(coreStore)
const geoLocationStore = useGeoLocationStore()
const { state } = storeToRefs(geoLocationStore)
const { layoutTag: iconMenuLayoutTag } = iconMenuStore
	? storeToRefs(iconMenuStore)
	: { layoutTag: computed(() => '') }

const icon = computed(() => {
	if (state.value === 'LOCATED') {
		return 'kern-icon-fill--near-me'
	} else if (state.value === 'LOCATABLE') {
		return 'kern-icon--near-me'
	}
	return 'kern-icon--near-me-disabled'
})
const tooltipPosition = computed(() =>
	geoLocationStore.configuration.renderType === 'iconMenu'
		? iconMenuLayoutTag.value.includes('RIGHT')
			? 'left'
			: 'right'
		: layout.value === 'standard' ||
			  geoLocationStore.configuration.layoutTag?.includes('RIGHT')
			? 'left'
			: 'right'
)
</script>
