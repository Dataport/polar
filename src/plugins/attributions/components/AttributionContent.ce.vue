<template>
	<PolarCard
		:style="`width: ${width}; max-width: ${maxWidth}`"
		:class="
			renderType === 'footer' && layout === 'nineRegions'
				? 'polar-plugin-attributions-footer'
				: ''
		"
	>
		<header v-if="renderType !== 'footer'" class="kern-card__header">
			<h2 class="kern-title">{{ $t(($) => $.title, { ns: PluginId }) }}</h2>
		</header>
		<section ref="sources" class="kern-card__body">
			<!-- NOTE: The usage of v-html is considered unsafe as it
        opens a window for XSS attacks. In this case, the information is retrieved
        from the mapConfiguration. This is fine by configuration. -->
			<!-- eslint-disable vue/no-v-html -->
			<p
				v-for="(text, i) in cardText"
				:key="i"
				class="kern-body"
				v-html="text"
			/>
			<!-- eslint-enable vue/no-v-html -->
		</section>
	</PolarCard>
</template>

<script lang="ts" setup>
import { t } from 'i18next'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'

import PolarCard from '@/components/PolarCard.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useAttributionsStore } from '../store'
import { PluginId } from '../types'

const coreStore = useCoreStore()
const attributionsStore = useAttributionsStore()

const { renderType } = storeToRefs(attributionsStore)
const { layout } = storeToRefs(coreStore)

const sources = useTemplateRef('sources')

const cardText = computed(() =>
	attributionsStore.mapInfo.map((x) => {
		// This reactive value needs to recompute on language changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		coreStore.language
		return t(($) => $[x], {
			MONTH: `${new Date().getMonth() + 1}`.padStart(2, '0'),
			YEAR: new Date().getFullYear().toString(),
			ns: PluginId,
		})
	})
)
const maxWidth = computed(() =>
	renderType.value === 'independent'
		? coreStore.hasWindowSize && coreStore.hasSmallWidth
			? coreStore.clientWidth * 0.85
			: 1080
		: 'inherit'
)
const width = computed(() =>
	renderType.value === 'independent' ? attributionsStore.windowWidth : 'inherit'
)

onMounted(() => {
	// NOTE: sources will always be defined unless someone removes the ref from the section element
	const links = (sources.value as HTMLElement).getElementsByTagName('a')
	if (links.length > 0) {
		void nextTick(() => {
			;(links[0] as HTMLAnchorElement).focus({ focusVisible: true })
		})
	}
})
</script>

<style scoped>
.kern-card {
	margin: 0 var(--kern-metric-space-small);

	.kern-body {
		padding: 0;
	}
}

.polar-plugin-attributions-footer {
	margin: var(--kern-metric-space-small);
}
</style>
