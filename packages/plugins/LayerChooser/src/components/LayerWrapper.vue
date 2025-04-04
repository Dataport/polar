<template>
  <v-tooltip left :disabled="hasSmallDisplay">
    <template #activator="{ on }">
      <div class="polar-layer-chooser-option-line" v-on="disabled && on">
        <slot></slot>
        <v-btn
          class="ml-1"
          :class="!hasOptions && 'polar-layer-chooser-option-invisible'"
          :aria-label="$t('plugins.layerChooser.layerOptions')"
          icon
          small
          @click="setOpenedOptions(layerId)"
        >
          <v-icon small>{{ icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    {{ $t('plugins.layerChooser.tooltipDisabledLayer') }}
  </v-tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { DisabledLayers } from '../types'

/**
 * Adds tooltip and option action to arbitrary selection element.
 */
export default Vue.extend({
  name: 'LayerChooserLayerWrapper',
  props: {
    disabledLayers: {
      type: Object as PropType<DisabledLayers>,
      required: true,
    },
    layerId: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'fa-gear',
    },
  },
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/layerChooser', ['idsWithOptions']),
    hasOptions() {
      return this.idsWithOptions.includes(this.layerId)
    },
    disabled() {
      return this.disabledLayers[this.layerId]
    },
  },
  methods: {
    ...mapMutations('plugin/layerChooser', ['setOpenedOptions']),
  },
})
</script>

<style lang="scss">
.polar-layer-chooser-option-line {
  > div {
    min-width: 0;
  }

  label {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block !important;
  }
}
</style>

<style lang="scss" scoped>
.polar-layer-chooser-option-line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.polar-layer-chooser-option-invisible {
  /* kept in DOM for even spacing */
  visibility: hidden;
}
</style>
