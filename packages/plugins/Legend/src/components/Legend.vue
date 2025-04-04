<template>
  <div class="polar-plugin-legend-wrapper">
    <div class="mr-2">
      <v-scroll-x-reverse-transition>
        <v-card
          v-show="isOpen"
          class="mx-auto pa-2"
          dense
          filled
          color="#ffffffdd"
        >
          <v-card-title>{{ $t('plugins.legend.title') }}</v-card-title>
          <v-card-text v-if="legends.length === 0">
            {{ $t('plugins.legend.empty') }}
          </v-card-text>
          <div class="polar-scroll-box" role="list" :style="maxHeight">
            <template v-for="({ legendUrl, name }, index) in legends">
              <div :key="'polar-legend-image-item-' + index" role="listitem">
                <div class="text-body-1">{{ $t(name) }}</div>
                <a
                  class="text-body-2"
                  :href="legendUrl"
                  :aria-label="$t('plugins.legend.openLegendTo', { name })"
                  target="_blank"
                >
                  <v-img
                    contain
                    :max-width="250"
                    :src="legendUrl"
                    :alt="$t('plugins.legend.legendTo', { name })"
                    :title="$t('plugins.legend.openLegendTo', { name })"
                  />
                </a>
              </div>
            </template>
          </div>
        </v-card>
      </v-scroll-x-reverse-transition>
    </div>
    <v-btn
      class="buttonSecondary"
      x-small
      fab
      color="secondary"
      :title="$t(`plugins.legend.button.${isOpen ? 'close' : 'open'}Title`)"
      @click="toggleMapLegend"
    >
      <v-icon color="secondaryContrast">{{ mapLegendIcon }}</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as masterportalapi from '@masterportal/masterportalapi'

export default Vue.extend({
  name: 'LegendPlugin',
  data: () => ({
    isOpen: false,
  }),
  computed: {
    ...mapGetters(['clientHeight', 'configuration', 'hasSmallHeight']),
    mapLegendIcon() {
      const icons = this.configuration.legend?.icons
      if (!this.isOpen) {
        return icons?.open ?? `fa-info`
      }
      return icons?.close ?? `fa-chevron-right`
    },
    maxHeight(): string {
      return `
        max-height: ${this.hasSmallHeight ? this.clientHeight * 0.5 : 300}px;
      `
    },
    legends() {
      // TODO: 'layers' should always be defined as MapConfig dictates
      return this.configuration?.layers
        ?.map(({ id, name }) => ({ id, name }))
        .map((layer) => ({
          ...layer,
          rawLayer: masterportalapi.rawLayerList.getLayerWhere({
            id: layer.id,
          }),
        }))
        .map((layer) => {
          if (layer.rawLayer === null) {
            // skip undefined layers
            console.warn(`@polar/plugin-legend: Unknown layer.`, layer)
            return {}
          }
          return {
            ...layer,
            legendUrl: masterportalapi.layerLib.getLegendURLs(
              layer.rawLayer
            )[0],
          }
        })
        .filter((layer) => layer.name && layer.legendUrl)
    },
  },
  methods: {
    toggleMapLegend() {
      this.isOpen = !this.isOpen
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-legend-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: end;
  padding: 6px;
}

.polar-scroll-box {
  overflow-y: scroll;
}
.buttonSecondary.v-btn:hover {
  border: solid var(--polar-secondary-contrast) !important;
  outline: solid var(--polar-secondary);
  outline-offset: 1px;
}
.buttonSecondary.v-btn:focus {
  border: solid var(--polar-secondary-contrast) !important;
  outline: solid var(--polar-secondary);
  outline-offset: 1px;
}
</style>
