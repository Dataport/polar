<template>
	<!-- TODO: Replace this component with the one from #463 (scale) -->
	<div class="kern-form-input__select-wrapper">
		<select
			v-model="selectedGroupId"
			class="kern-form-input__select"
			:aria-label="$t(($) => $.groupSelector, { ns: PluginId })"
		>
			<!-- Mapping in template to guarantee update on language change-->
			<option
				v-for="{ groupId, text } in groupSelectOptions"
				:key="groupId"
				:value="groupId"
			>
				{{ $t(($) => $[text], { ns: PluginId }) }}
			</option>
		</select>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAddressSearchStore } from '../store'
import { PluginId } from '../types'

const { groupSelectOptions, selectedGroupId } = storeToRefs(
	useAddressSearchStore()
)
</script>
