<template>
  <div v-if="renderUi" id="polar-plugin-gfi">
    <v-card v-if="!windowLayerKeysActive">
      <v-card-text>{{ $t('plugins.gfi.noActiveLayer') }}</v-card-text>
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
import { MoveHandleProperties } from '@polar/lib-custom-types'
import Feature from './Feature.vue'
import List from './List.vue'

export default Vue.extend({
  name: 'GfiPlugin',
  computed: {
    ...mapGetters(['moveHandle']),
    ...mapGetters('plugin/gfi', [
      'gfiContentComponent',
      'gfiConfiguration',
      'renderMoveHandle',
      'renderType',
      'showList',
      'windowFeatures',
      'windowLayerKeysActive',
    ]),
    contentComponent(): Vue {
      return this.showList ? List : this.gfiContentComponent || Feature
    },
    contentProps(): object {
      return this.showList ? {} : {}
    },
    moveHandleProperties() {
      const properties: MoveHandleProperties = {
        closeIcon: this.gfiConfiguration.featureList
          ? 'fa-angles-right'
          : 'fa-xmark',
        closeLabel: t('plugins.gfi.header.close'),
        closeFunction: this.closeWindow,
        component: this.contentComponent,
        props: this.contentProps,
        plugin: this.renderType === 'independent' ? 'gfi' : 'iconMenu',
      }

      return properties
    },
    renderUi(): boolean {
      return this.windowFeatures.length > 0 || this.showList
    },
  },
  watch: {
    moveHandleProperties(
      newProperties: MoveHandleProperties,
      oldProperties: MoveHandleProperties
    ) {
      if (
        this.windowFeatures.length &&
        !compare(newProperties, oldProperties)
      ) {
        this.setMoveHandle(newProperties)
      } else if (
        !this.windowFeatures.length &&
        this.moveHandle !== null &&
        this.moveHandle.component === this.contentComponent
      ) {
        this.setMoveHandle(null)
      }
    },
  },
  methods: {
    ...mapMutations(['setMoveHandle']),
    ...mapActions('plugin/gfi', ['close']),
    closeWindow(userInteraction: boolean) {
      this.close(userInteraction)
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
