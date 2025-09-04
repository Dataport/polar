<template>
	<v-card class="layer-chooser-selection">
		<template v-if="backgrounds.length">
			<v-card-text>
				<v-radio-group v-model="activeBackground" dense hide-details>
					<template v-for="{ name, id } in backgrounds">
						<LayerWrapper
							:key="`background-layer-${id}`"
							:disabled-layers="disabledBackgrounds"
							:layer-id="id"
						>
							<v-radio
								aria-describedby="polar-label-background-title"
								dense
								hide-details
								:label="$t(name)"
								:value="id"
								:disabled="disabledBackgrounds[id]"
								@keydown.up.stop
								@keydown.right.stop
								@keydown.down.stop
								@keydown.left.stop
							></v-radio>
						</LayerWrapper>
					</template>
				</v-radio-group>
			</v-card-text>
		</template>
		<template v-if="shownMasks.length">
			<template v-for="[type, masks] in Object.entries(masksSeparatedByType)">
				<v-card-text :key="`layer-chooser-mask-text-${type}`">
					<template v-for="{ name, id } in masks">
						<LayerWrapper
							:key="`mask-layer-${type}-${id}`"
							:disabled-layers="disabledMasks"
							:layer-id="id"
						>
							<v-checkbox
								v-model="activeMasks"
								:label="$t(name)"
								:value="id"
								:aria-describedby="`polar-label-${type}-title`"
								dense
								hide-details
								class="cut-off-top-space"
								:disabled="disabledMasks[id]"
							/>
						</LayerWrapper>
					</template>
				</v-card-text>
			</template>
		</template>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import LayerWrapper from './LayerWrapper.vue'

export default Vue.extend({
	name: 'LayerChooserSelection',
	components: { LayerWrapper },
	computed: {
		...mapGetters('plugin/layerChooser', [
			'backgrounds',
			'disabledBackgrounds',
			'disabledMasks',
			'masksSeparatedByType',
			'shownMasks',
		]),
	},
})
</script>
