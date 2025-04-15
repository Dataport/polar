<template>
  <v-card class="layer-chooser-options">
    <v-card-actions>
      <v-btn
        id="polar-layer-chooser-options-back-button"
        icon
        small
        :aria-label="$t('plugins.layerChooser.returnToLayers')"
        @click="closeOptions"
      >
        <v-icon small>fa-chevron-left</v-icon>
      </v-btn>
      <v-card-title class="layer-chooser-options-card-title">{{
        $t('plugins.layerChooser.optionsHeader', openedOptionsService)
      }}</v-card-title>
    </v-card-actions>
    <template
      v-if="openedOptionsService.options.layers && openedOptionsServiceLayers"
    >
      <v-card-title id="polar-label-options-layer-title">{{
        $t('plugins.layerChooser.layerHeader')
      }}</v-card-title>
      <v-card-text>
        <template
          v-for="{
            layerName,
            displayName,
            layerImage,
          } in openedOptionsServiceLayers"
        >
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
    </template>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'LayerChooserOptions',
  computed: {
    ...mapGetters('plugin/layerChooser', [
      'activeLayerIds',
      'openedOptions',
      'openedOptionsService',
      'openedOptionsServiceLayers',
    ]),
    activeLayers: {
      get() {
        return this.activeLayerIds[this.openedOptionsService.id]
      },
      set(value) {
        this.toggleOpenedOptionsServiceLayer(value)
      },
    },
  },
  methods: {
    ...mapMutations('plugin/layerChooser', ['setOpenedOptions']),
    ...mapActions('plugin/layerChooser', ['toggleOpenedOptionsServiceLayer']),
    closeOptions() {
      const previousOptions = this.openedOptions
      this.setOpenedOptions(null)
      this.$nextTick(() => {
        const button = (
          document.querySelector('[data-app]') as ShadowRoot
        ).getElementById(
          `polar-layer-chooser-options-${previousOptions}-button`
        )
        // Sadly needed as the button is not focused otherwise.
        setTimeout(() => button?.focus(), 0)
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
