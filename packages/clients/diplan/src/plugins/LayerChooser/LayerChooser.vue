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
            <LayerWrapper
              v-for="({ name, id }, index) in backgrounds"
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
          </v-radio-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="shownMasks.length">
        <v-expansion-panel-header id="polar-label-mask-title">
          {{ $t('plugins.layerChooser.maskTitle') }}
        </v-expansion-panel-header>
        <v-divider />
        <v-expansion-panel-content>
          <template v-if="displaySelection">
            <template v-for="({ name, id }, index) in shownMasks">
              <LayerWrapper
                :key="'disabled-mask-' + index"
                :index="index"
                :disabled-layers="disabledMasks"
                :layer-id="id"
              >
                <v-checkbox
                  v-model="activeMasks"
                  :label="$t(name)"
                  :value="id"
                  aria-describedby="polar-label-mask-title"
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
      <v-expansion-panel v-if="xplanLayers.length">
        <v-expansion-panel-header id="polar-label-xplan-title">
          {{ $t('plugins.layerChooser.xplanTitle') }}
        </v-expansion-panel-header>
        <v-divider />
        <v-expansion-panel-content>
          <template v-for="({ name, id }, index) in xplanLayers">
            <LayerWrapper
              :key="'disabled-xplan-' + index"
              :index="index"
              :layer-id="id"
            >
              <v-checkbox
                v-model="activeXplanLayers"
                :label="$t(name)"
                :value="id"
                aria-describedby="polar-label-xplan-title"
                dense
                hide-details
                class="cut-off-top-space"
              />
            </LayerWrapper>
            <v-divider :key="index" />
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { rawLayerList } from '@masterportal/masterportalapi'
import { LayerChooserOptions } from '@polar/plugin-layer-chooser'
import { LayerConfiguration } from '@polar/lib-custom-types'
import { areLayersActive } from '@polar/plugin-layer-chooser/src/utils/layerFolding'
import LayerWrapper from './LayerWrapper.vue'

export default Vue.extend({
  name: 'LayerChooser',
  components: {
    LayerWrapper,
    LayerChooserOptions,
  },
  data: () => ({ activeXplanIds: [] }),
  computed: {
    ...mapGetters(['configuration', 'map']),
    ...mapGetters('plugin/layerChooser', [
      'activeBackgroundId',
      'activeMaskIds',
      'backgrounds',
      'disabledBackgrounds',
      'disabledMasks',
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
    activeXplanLayers: {
      get() {
        return this.activeXplanIds
      },
      set(value) {
        this.activeXplanIds = value
        this.setActiveXplanIdsVisibility(value)
      },
    },
    displaySelection() {
      return this.openedOptions === null
    },
    xplanLayers() {
      return areLayersActive(
        this.configuration.layers.reduce((acc, current) => {
          const rawLayer = rawLayerList.getLayerWhere({
            id: current.id,
          })

          if (rawLayer === null) {
            console.error(
              `@polar/plugin-layer-chooser: Layer ${current.id} not found in service register. This is a configuration issue. The map might behave in unexpected ways.`,
              current
            )
            return acc
          }
          if (current.type === 'xplan') {
            return [...acc, current]
          }
          return acc
        }, [] as LayerConfiguration[]),
        this.map.getView().getZoom() as number
      )
    },
  },
  mounted() {
    this.activeXplanLayers = this.xplanLayers
      .filter(({ visibility }) => visibility)
      .map(({ id }) => id)
  },
  methods: {
    ...mapActions('plugin/layerChooser', [
      'setActiveBackgroundId',
      'setActiveMaskIds',
    ]),
    setActiveXplanIdsVisibility(ids: string[]) {
      this.map
        .getLayers()
        .getArray()
        .forEach((layer) => {
          // only influence visibility if layer is managed as background
          if (this.xplanLayers.find(({ id }) => id === layer.get('id'))) {
            layer.setVisible(ids.includes(layer.get('id')))
          }
        })
    },
  },
})
</script>

<style lang="scss">
.layer-chooser-selection {
  .v-expansion-panel-content__wrap {
    padding: 0;
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
