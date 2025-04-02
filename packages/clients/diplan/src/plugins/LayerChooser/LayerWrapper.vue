<template>
  <LayerChooserLayerWrapper
    :disabled-layers="disabledLayers"
    :layer-id="layerId"
    icon="$vuetify.icons.gear-outline"
  >
    <slot></slot>
  </LayerChooserLayerWrapper>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  DisabledLayers,
  LayerChooserLayerWrapper,
} from '@polar/plugin-layer-chooser'

/**
 * Adds tooltip and option action to arbitrary selection element.
 */
export default Vue.extend({
  name: 'DiplanLayerWrapper',
  components: {
    LayerChooserLayerWrapper,
  },
  props: {
    disabledLayers: {
      type: Object as PropType<DisabledLayers>,
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
