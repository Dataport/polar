<template>
  <LayerChooserLayerWrapper
    :index="index"
    :disabled-layers="disabledLayers"
    :layer-id="layerId"
    icon="$vuetify.icons.gear-outline"
  >
    <slot></slot>
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
      type: [Array, Object],
      required: true,
    },
    layerId: {
      type: String,
      required: true,
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
