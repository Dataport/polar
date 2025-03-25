<template>
  <v-card class="layer-chooser-options">
    <v-card-actions>
      <v-btn
        icon
        small
        :aria-label="$t('plugins.layerChooser.returnToLayers')"
        @click="setOpenedOptions(null)"
      >
        <v-icon small>fa-chevron-left</v-icon>
      </v-btn>
      <v-card-title class="layer-chooser-options-card-title">{{
        $t('plugins.layerChooser.optionsHeader', { name: $t(service.name) })
      }}</v-card-title>
    </v-card-actions>
    <v-card-title id="polar-label-options-layer-title">{{
      $t('plugins.layerChooser.layerHeader')
    }}</v-card-title>
    <v-card-text>
      <template v-for="{ layerName, displayName, layerImage } in layers">
        <v-checkbox
          :key="`layer-chooser-layer-option-${layerName}`"
          v-model="activeLayers"
          :label="$t(displayName)"
          :value="layerName"
          aria-describedby="polar-label-options-layer-title"
          dense
          hide-details
          :disabled="
            activeLayers.length === 1 && activeLayers.includes(layerName)
          "
        >
          <template v-if="layerImage" #prepend>
            <img :src="layerImage" />
          </template>
        </v-checkbox>
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'XplanLayerChooserOptions',
  props: {
    layers: {
      type: Array,
      required: true,
    },
    service: {
      type: Object,
      required: true,
    },
    setOpenedOptions: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['map']),
    ...mapGetters('plugin/layerChooser', ['activeLayerIds']),
    activeLayers: {
      get() {
        return this.activeLayerIds[this.service.id]
      },
      set(value) {
        this.toggleOpenedOptionsServiceLayer(value)
      },
    },
  },
  methods: {
    ...mapMutations('plugin/layerChooser', ['setActiveLayerIds']),
    toggleOpenedOptionsServiceLayer(value: string) {
      // keep configured layer order - vuetify puts last activated last
      const sortedValue =
        this.layers === null
          ? value
          : this.layers
              .filter(({ layerName }) => value.includes(layerName))
              .map(({ layerName }) => layerName)
              .reverse()
      const olLayer = this.map
        .getLayers()
        .getArray()
        .find((l) => l.get('id') === this.service.id)
      const olSource = olLayer?.getSource?.()

      if (!olLayer || !olSource) {
        console.error(
          `@polar/plugin-layer-chooser: Action 'toggleOpenedOptionsServiceLayer' failed on ${this.service.id} with value ${sortedValue}. Layer not found in OL, or source not initialized in OL.`
        )
        return
      }

      const updatedParams = { ...olSource.getParams(), LAYERS: sortedValue }

      olSource.updateParams(updatedParams)
      this.setActiveLayerIds({
        ...this.activeLayerIds,
        [this.service.id]: sortedValue,
      })
    },
  },
})
</script>

<style lang="scss">
.layer-chooser-options {
  label {
    text-overflow: ellipsis;
    overflow: hidden;
    flex-wrap: nowrap;
    display: inline-block !important;
    margin-bottom: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.layer-chooser-options {
  display: flex;
  flex-direction: column;
  max-width: inherit;
  white-space: nowrap;

  label {
    text-overflow: ellipsis;
    overflow: hidden;
    flex-wrap: nowrap;
    display: inline-block;
  }

  .v-card__title {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 100%;
  }
  .v-card__actions {
    white-space: normal;
  }
}

.layer-chooser-options-card-title {
  line-height: initial;
  word-break: initial;
}
</style>
