<template>
	<div class="action-bar">
		<div class="action-bar-group">
			<KernButton
				v-if="gfiStore.featureIndex > 0"
				class="kern-btn--tertiary"
				icon="kern-icon--arrow-back"
				:label-sr-only="true"
				@click="gfiStore.featureIndex--"
			>
				{{ $t(($) => $.switch.previous, { ns: PluginId }) }}
			</KernButton>
			<KernButton
				v-if="gfiStore.featureIndex + 1 < gfiStore.features.length"
				class="kern-btn--tertiary"
				icon="kern-icon--arrow-forward"
				:label-sr-only="true"
				@click="gfiStore.featureIndex++"
			>
				{{ $t(($) => $.switch.next, { ns: PluginId }) }}
			</KernButton>
		</div>
		<div class="action-bar-group">
			<KernButton
				v-if="gfiStore.exportProperty"
				class="kern-btn--tertiary"
				icon="kern-icon--download"
				:label-sr-only="true"
				@click="startDownload(gfiStore.exportProperty)"
			>
				{{ $t(($) => $.property.export, { ns: PluginId }) }}
			</KernButton>
			<KernButton
				class="kern-btn--tertiary"
				:icon="
					gfiStore.configuration.featureList
						? 'kern-icon--keyboard-double-arrow-right'
						: 'kern-icon--close'
				"
				:label-sr-only="true"
				@click="gfiStore.selectedFeatures = markRaw({})"
			>
				{{
					$t(
						($) =>
							gfiStore.configuration.featureList
								? $.header.closeToList
								: $.header.close,
						{ ns: PluginId }
					)
				}}
			</KernButton>
		</div>
	</div>
	<table class="kern-table kern-table--striped">
		<caption v-if="gfiStore.title" class="kern-title">
			{{
				gfiStore.title
			}}
		</caption>
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
import { markRaw } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
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
.action-bar {
	width: 100%;
	display: flex;
	justify-content: space-between;

	.action-bar-group {
		display: flex;
		gap: var(--kern-metric-space-small);
	}
}

td {
	white-space: normal;
}
</style>
