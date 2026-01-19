<template>
	<PolarIconButton
		:hint="$t(($) => $.header.close, { ns: 'gfi' })"
		icon="kern-icon--close"
		@click="gfiStore.featureInformation = {}"
	/>
	<table class="kern-table kern-table--striped">
		<thead class="kern-table__head">
			<tr class="kern-table__row">
				<th scope="col" class="kern-table__header">
					{{ $t(($) => $.header.field, { ns: 'gfi' }) }}
				</th>
				<th scope="col" class="kern-table__header">
					{{ $t(($) => $.header.value, { ns: 'gfi' }) }}
				</th>
			</tr>
		</thead>

		<tbody class="kern-table__body">
			<tr
				v-for="[key, value] of Object.entries(filteredProperties)"
				:key="key"
				class="kern-table__row"
			>
				<td class="kern-table__cell">
					{{
						$t(($) => $['layer'][props.layerId]['property'][key], {
							ns: 'gfi',
							defaultValue: key,
						})
					}}
				</td>
				<td class="kern-table__cell">
					<template v-if="isValidHttpUrl(value)">
						<template
							v-if="
								['jpg', 'jpeg', 'png', 'gif', 'webp'].some((ext) =>
									value.endsWith(`.${ext}`)
								)
							"
						>
							<a :href="value" target="_blank">
								<img
									:src="value"
									:alt="$t(($) => $.property.imageAlt, { ns: 'gfi' })"
									:title="$t(($) => $.property.linkTitle, { ns: 'gfi' })"
									:height="Math.min(200, coreStore.clientHeight * 0.15)"
									width="auto"
								/>
							</a>
						</template>
						<template v-else>
							<a
								:href="value"
								target="_blank"
								:title="$t(($) => $.property.linkTitle, { ns: 'gfi' })"
							>
								{{ $t(($) => $.property.linkText, { ns: 'gfi' }) }}
							</a>
						</template>
					</template>
					<template v-else>
						{{ value }}
					</template>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson'

import { computed } from 'vue'

import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useGfiStore } from '../store'
import { isValidHttpUrl } from '../utils/isValidHttpUrl'

const coreStore = useCoreStore()
const gfiStore = useGfiStore()

const props = defineProps<{
	layerId: string
	feature: GeoJsonFeature
}>()

const layerConfiguration = computed(
	() => gfiStore.configuration.layers[props.layerId] || {}
)

const filteredProperties = computed(() =>
	Object.fromEntries(
		Object.entries(props.feature.properties || {})
			.filter(
				([key]) =>
					!layerConfiguration.value.properties ||
					layerConfiguration.value.properties.includes(key)
			)
			.map(([key, value]) => [key, value])
	)
)
</script>

<style scoped>
td {
	white-space: normal;
}
</style>
