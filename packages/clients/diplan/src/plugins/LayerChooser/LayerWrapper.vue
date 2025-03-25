<template>
  <LayerChooserLayerWrapper
    :index="index"
    :disabled-layers="disabledLayers"
    :layer-id="layerId"
    icon="$vuetify.icons.gear-outline"
    :show-options-button="false"
  >
    <slot></slot>
    <v-btn
      v-if="hasOptions"
      class="ml-1"
      :aria-label="$t('plugins.layerChooser.layerOptions')"
      icon
      small
      @click="setOpenedOptions(layerId)"
    >
      <v-icon small>$vuetify.icons.gear-outline</v-icon>
    </v-btn>
  </LayerChooserLayerWrapper>
</template>

<script lang="ts">
import Vue from 'vue'
import { LayerChooserLayerWrapper } from '@polar/plugin-layer-chooser'

/**
 * Adds tooltip and option action to arbitrary selection element.
 */
export default Vue.extend({
  name: 'DiplanLayerWrapper',
  components: {
    LayerChooserLayerWrapper,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    disabledLayers: {
      type: Array,
      default: () => [],
    },
    layerId: {
      type: String,
      required: true,
    },
    hasOptions: {
      type: Boolean,
      default: false,
    },
    setOpenedOptions: {
      type: Function,
      default: null,
    },
  },
})
</script>

<style lang="scss">
.polar-layer-chooser-option-line {
  align-items: center;
  margin: 16px;

  label {
    margin: 0;
  }
}
</style>

<style lang="scss" scoped></style>
