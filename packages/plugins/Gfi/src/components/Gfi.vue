<template>
  <div v-if="renderUi" id="polar-plugin-gfi">
    <MoveHandle
      v-if="hasWindowSize && hasSmallWidth"
      :max-height="maxMobileHeight"
    >
      <component
        :is="contentComponent"
        :current-properties="currentProperties"
        :client-width="clientWidth"
        :export-property="exportProperty"
        :show-switch-buttons="showSwitchButtons"
      ></component>
    </MoveHandle>
    <component
      :is="contentComponent"
      v-else
      :current-properties="currentProperties"
      :client-width="clientWidth"
      :export-property="exportProperty"
      :show-switch-buttons="showSwitchButtons"
    ></component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GeoJsonProperties } from 'geojson'
import { mapGetters } from 'vuex'
import { MoveHandle } from '@polar/components'
import GfiContent from './GfiContent.vue'

export default Vue.extend({
  name: 'PolarGfi',
  components: {
    MoveHandle,
  },
  data: () => ({ clientWidth: 0, maxMobileHeight: 1 }),
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/gfi', [
      'exportPropertyLayerKeys',
      'windowFeatures',
      'visibleWindowFeatureIndex',
      'gfiContentComponent',
    ]),
    contentComponent(): Vue {
      return this.gfiContentComponent || GfiContent
    },
    currentProperties(): GeoJsonProperties {
      const properties = {
        ...this.windowFeatures[this.visibleWindowFeatureIndex],
      }
      const exportProperty =
        this.exportPropertyLayerKeys[properties.polarInternalLayerKey]
      if (exportProperty.length > 0) {
        delete properties[exportProperty]
      }
      return properties
    },
    exportProperty(): string {
      if (this.currentProperties) {
        const property =
          this.exportPropertyLayerKeys[
            this.currentProperties.polarInternalLayerKey
          ]
        return property.length > 0
          ? this.windowFeatures[this.visibleWindowFeatureIndex][property]
          : ''
      }
      return ''
    },
    renderUi(): boolean {
      return this.windowFeatures.length > 0
    },
    /** only show switch buttons if multiple property sets are available */
    showSwitchButtons(): boolean {
      return this.windowFeatures.length > 1
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.updateClientWidth()
      this.updateMaxMobileHeight()
    })
    this.updateClientWidth()
  },
  updated() {
    this.$nextTick(this.updateMaxMobileHeight)
  },
  methods: {
    updateClientWidth() {
      this.clientWidth = this.$root.$el.clientWidth
    },
    updateMaxMobileHeight() {
      // Only update if the element is actually rendered
      if (this.$el.clientHeight) {
        this.maxMobileHeight =
          this.$el.clientHeight / this.$root.$el.clientHeight
      }
    },
  },
})
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 769px) {
  #polar-plugin-gfi {
    margin-left: 1em;
    margin-bottom: 1em;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    pointer-events: all;

    &::v-deep .v-data-table__wrapper {
      /* table cell padding underlaps scrollbar; prevent horizontal scroll */
      overflow-x: clip;
    }
  }
}
</style>
