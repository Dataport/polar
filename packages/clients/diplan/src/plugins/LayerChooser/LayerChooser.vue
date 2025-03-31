<template>
  <v-card class="layer-chooser-selection">
    <v-expansion-panels accordion>
      <v-expansion-panel v-if="backgrounds.length">
        <v-expansion-panel-header id="polar-label-background-title">
          {{ $t('plugins.layerChooser.backgroundTitle') }}
        </v-expansion-panel-header>
        <v-divider />
        <v-expansion-panel-content>
          <v-radio-group v-model="activeBackground" dense hide-details>
            <template v-for="({ name, id }, index) in backgrounds">
              <LayerWrapper
                :key="'disabled-background-' + index"
                :index="index"
                :disabled-layers="disabledBackgrounds"
                :layer-id="id"
              >
                <v-radio
                  :key="index"
                  aria-describedby="polar-label-background-title"
                  dense
                  hide-details
                  :label="$t(name)"
                  :value="id"
                  :disabled="disabledBackgrounds[index]"
                />
              </LayerWrapper>
              <v-divider :key="index" />
            </template>
          </v-radio-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <template v-if="shownMasks.length">
        <v-expansion-panel
          v-for="[type, masks] in Object.entries(masksSeparatedByType)"
          :key="`layer-chooser-mask-title-${type}`"
        >
          <v-expansion-panel-header :id="`polar-label-${type}-title`">
            {{ $t(`plugins.layerChooser.${type}Title`) }}
          </v-expansion-panel-header>
          <v-divider />
          <v-expansion-panel-content>
            <template v-if="displaySelection">
              <template v-for="({ name, id }, index) in masks">
                <LayerWrapper
                  :key="`disabled-mask-${type}-${index}`"
                  :index="Number(index)"
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
                    :disabled="disabledMasks[index]"
                  />
                </LayerWrapper>
                <v-divider :key="index" />
              </template>
            </template>
            <LayerChooserOptions v-else />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { LayerChooserOptions } from '@polar/plugin-layer-chooser'
import LayerWrapper from './LayerWrapper.vue'

export default Vue.extend({
  name: 'LayerChooser',
  components: {
    LayerWrapper,
    LayerChooserOptions,
  },
  computed: {
    ...mapGetters('plugin/layerChooser', [
      'activeBackgroundId',
      'activeMaskIds',
      'backgrounds',
      'disabledBackgrounds',
      'disabledMasks',
      'masksSeparatedByType',
      'openedOptions',
      'shownMasks',
    ]),
    activeBackground: {
      get() {
        return this.activeBackgroundId
      },
      set(value) {
        this.setActiveBackgroundId(value)
      },
    },
    activeMasks: {
      get() {
        return this.activeMaskIds
      },
      set(value) {
        this.setActiveMaskIds(value)
      },
    },
    displaySelection() {
      return this.openedOptions === null
    },
  },
  methods: {
    ...mapActions('plugin/layerChooser', [
      'setActiveBackgroundId',
      'setActiveMaskIds',
    ]),
  },
})
</script>

<style lang="scss">
.layer-chooser-selection {
  .v-expansion-panel-content__wrap {
    padding: 0;
  }

  .v-label {
    margin: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.layer-chooser-selection {
  min-width: 300px;
  overflow-y: inherit;

  // tone down spacing
  .v-expansion-panel-header.v-expansion-panel-header--active {
    min-height: 48px;
  }

  .v-card__title {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 100%;
  }

  .v-input--radio-group {
    margin-top: 0;
    padding-top: 0;
  }

  .v-radio {
    margin-bottom: 0 !important;
  }

  .cut-off-top-space {
    margin-top: 0;
    padding-top: 0;
  }
}
</style>
