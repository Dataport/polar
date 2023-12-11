<template>
  <div v-if="renderUi" id="polar-plugin-gfi">
    <v-card v-if="!windowLayerKeysActive">
      <v-card-text>{{ $t('common:plugins.gfi.noActiveLayer') }}</v-card-text>
    </v-card>
    <component
      :is="contentComponent"
      v-else-if="!renderMoveHandle"
      v-bind="contentProps"
    />
  </div>
</template>

<script lang="ts">
import compare from 'just-compare'
import { t } from 'i18next'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { GeoJsonProperties } from 'geojson'
import {
  MoveHandleActionButton,
  MoveHandleProperties,
} from '@polar/lib-custom-types'
import Feature from './Feature.vue'
import List from './List.vue'

export default Vue.extend({
  name: 'GfiPlugin',
  data: () => ({ clientWidth: 0 }),
  computed: {
    ...mapGetters(['moveHandle']),
    ...mapGetters('plugin/gfi', [
      'actionButton',
      'exportPropertyLayerKeys',
      'gfiContentComponent',
      'gfiConfiguration',
      'renderMoveHandle',
      'renderType',
      'showList',
      'visibleWindowFeatureIndex',
      'windowFeatures',
      'windowLayerKeysActive',
    ]),
    contentComponent(): Vue {
      return this.showList ? List : this.gfiContentComponent || Feature
    },
    contentProps(): object {
      return this.showList
        ? {}
        : {
            currentProperties: this.currentProperties,
            clientWidth: this.clientWidth,
            exportProperty: this.exportProperty,
            showSwitchButtons: this.showSwitchButtons,
          }
    },
    currentProperties(): GeoJsonProperties {
      const properties = {
        ...this.windowFeatures[this.visibleWindowFeatureIndex],
      }
      const exportProperty =
        this.exportPropertyLayerKeys[properties.polarInternalLayerKey]
      if (exportProperty?.length > 0) {
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
      return this.windowFeatures.length > 0 || this.showList
    },
    /** only show switch buttons if multiple property sets are available */
    showSwitchButtons(): boolean {
      return this.windowFeatures.length > 1
    },
  },
  watch: {
    actionButton(
      newButton: MoveHandleActionButton | null,
      oldButton: MoveHandleActionButton | null
    ) {
      if (this.windowFeatures.length && !compare(newButton, oldButton)) {
        const moveHandleProperties: MoveHandleProperties = {
          closeLabel: t('plugins.gfi.header.close'),
          closeFunction: this.closeWindow,
          component: this.contentComponent,
          props: this.contentProps,
          plugin: this.renderType === 'independent' ? 'gfi' : 'iconMenu',
        }
        if (newButton !== null) {
          moveHandleProperties.actionButton = newButton
        }
        this.setMoveHandle(moveHandleProperties)
      }
    },
    windowFeatures(features: GeoJsonProperties[]) {
      if (features.length) {
        const moveHandleProperties: MoveHandleProperties = {
          closeLabel: t('plugins.gfi.header.close'),
          closeFunction: this.closeWindow,
          component: this.contentComponent,
          props: this.contentProps,
          plugin: this.renderType === 'independent' ? 'gfi' : 'iconMenu',
        }
        if (this.actionButton !== null) {
          moveHandleProperties.actionButton = this.actionButton
        }
        this.setMoveHandle(moveHandleProperties)
      } else if (
        this.moveHandle !== null &&
        this.moveHandle.component === this.contentComponent
      ) {
        this.setMoveHandle(null)
      }
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.updateClientWidth()
    })
    this.updateClientWidth()
  },
  methods: {
    ...mapMutations(['setMoveHandle']),
    ...mapActions('plugin/gfi', ['close']),
    closeWindow() {
      this.close()
      // The list view is currently only implemented if the gfi is rendered as part of the iconMenu.
      // TODO: Finding a different solution may be a task to be tackled in the future
      if (
        this.gfiConfiguration.featureList &&
        this.$store.hasModule(['plugin', 'iconMenu']) &&
        this.$store.getters['plugin/iconMenu/open'] !== null
      ) {
        this.$store.dispatch(
          'plugin/iconMenu/openInMoveHandle',
          this.$store.getters['plugin/iconMenu/menus'].findIndex(
            ({ id }) => id === 'gfi'
          )
        )
      }
    },
    updateClientWidth() {
      this.clientWidth = this.$root.$el.clientWidth
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
    min-width: 300px;

    &::v-deep .v-data-table__wrapper {
      /* table cell padding underlaps scrollbar; prevent horizontal scroll */
      overflow-x: clip;
    }
  }
}
</style>
