<template>
	<div
		style="
			width: 100%;
			display: flex;
			justify-content: flex-end;
			gap: var(--kern-metric-space-default);
		"
	>
		<PolarIconButton
			v-if="gfiStore.exportProperty"
			:hint="$t(($) => $.property.export, { ns: PluginId })"
			icon="kern-icon--download"
			@click="startDownload(gfiStore.exportProperty)"
		/>
		<PolarIconButton
			:hint="$t(($) => $.header.close, { ns: PluginId })"
			icon="kern-icon--close"
			@click="gfiStore.selectedFeatures = {}"
		/>
	</div>
	<table class="kern-table kern-table--striped">
		<thead class="kern-table__head">
			<tr class="kern-table__row">
				<th scope="col" class="kern-table__header">
					{{ $t(($) => $.header.field, { ns: PluginId }) }}
				</th>
				<th scope="col" class="kern-table__header">
					{{ $t(($) => $.header.value, { ns: PluginId }) }}
				</th>
			</tr>
		</thead>

		<tbody class="kern-table__body">
			<tr
				v-for="[key, value] of Object.entries(gfiStore.properties)"
				:key="key"
				class="kern-table__row"
			>
				<td class="kern-table__cell">
					{{
						$t(($) => $['layer'][layerId]['property'][key], {
							ns: PluginId,
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
									:alt="$t(($) => $.property.imageAlt, { ns: PluginId })"
									:title="$t(($) => $.property.linkTitle, { ns: PluginId })"
									:height="Math.min(200, coreStore.clientHeight * 0.15)"
									width="auto"
								/>
							</a>
						</template>
						<template v-else>
							<a
								:href="value"
								target="_blank"
								:title="$t(($) => $.property.linkTitle, { ns: PluginId })"
							>
								{{ $t(($) => $.property.linkText, { ns: PluginId }) }}
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
import PolarIconButton from '@/components/PolarIconButton.ce.vue'
import { useCoreStore } from '@/core/stores'

import { useGfiStore } from '../store'
import { PluginId } from '../types'
import { isValidHttpUrl } from '../utils/isValidHttpUrl'

const coreStore = useCoreStore()
const gfiStore = useGfiStore()

defineProps<{
	layerId: string
}>()

function startDownload(url: string) {
	open(url)
}
</script>

<style scoped>
td {
	white-space: normal;
}
</style>
