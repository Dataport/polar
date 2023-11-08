<template>
  <v-tooltip left>
    <template #activator="{ on }">
      <div
        class="polar-layer-chooser-option-line"
        v-on="disabledLayers[index] && on"
      >
        <slot></slot>
        <v-btn
          class="ml-1"
          :class="!hasOptions && 'polar-layer-chooser-option-invisible'"
          :aria-label="$t('common:plugins.layerChooser.layerOptions')"
          icon
          small
          @click="setOpenedOptions(layerId)"
        >
          <v-icon small>fa-gear</v-icon>
        </v-btn>
      </div>
    </template>
    {{ $t('common:plugins.layerChooser.tooltipDisabledLayer') }}
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

/**
 * Adds tooltip and option action to arbitrary selection element.
 */
export default Vue.extend({
  name: 'LayerChooserLayerWrapper',
  props: {
    index: {
      type: Number,
      required: true,
    },
    disabledLayers: {
      type: Array,
      required: true,
    },
    layerId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('plugin/layerChooser', ['idsWithOptions']),
    hasOptions() {
      return this.idsWithOptions.includes(this.layerId)
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
