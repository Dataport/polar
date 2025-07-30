<template>
  <v-app class="polar-wrapper" :lang="lang">
    <MoveHandle
      v-if="renderMoveHandle"
      ref="moveHandleElement"
      :key="moveHandleKey"
      :close-label="moveHandle.closeLabel"
      :close-function="moveHandle.closeFunction"
    >
      <template v-if="moveHandleActionButton" #actionButton>
        <component
          :is="moveHandleActionButton.component"
          v-bind="moveHandleActionButton.props"
        />
      </template>
      <template v-if="moveHandle.closeIcon" #closeIcon>
        {{ moveHandle.closeIcon }}
      </template>
      <template #default>
        <component :is="moveHandle.component" v-bind="moveHandle.props || {}" />
      </template>
    </MoveHandle>
  </v-app>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import api from '@masterportal/masterportalapi/src/maps/api'
import { MoveHandle } from '@polar/components'
import i18next from 'i18next'
import { defaults } from 'ol/interaction'
import {
  Locale,
  MapConfig,
  MoveHandleProperties,
} from '@polar/lib-custom-types'
import { mapZoomOffset } from '../utils/mapZoomOffset'
// NOTE: OpenLayers styles need to be imported as the map resides in the shadow DOM
import 'ol/ol.css'

export default Vue.extend({
  components: {
    MoveHandle,
  },
  props: {
    mapConfiguration: {
      type: Object as PropType<MapConfig>,
      required: true,
    },
  },
  data: (): {
    lang: 'de' | 'en'
    moveHandleKey: number
  } => ({
    lang: 'de',
    moveHandleKey: 0,
  }),
  computed: {
    ...mapGetters([
      'hasSmallWidth',
      'hasWindowSize',
      'map',
      'moveHandle',
      'moveHandleActionButton',
    ]),
    renderMoveHandle() {
      return (
        this.moveHandle !== null && this.hasWindowSize && this.hasSmallWidth
      )
    },
  },
  watch: {
    moveHandle(_: MoveHandleProperties, oldHandle: MoveHandleProperties) {
      // Makes sure the previous plugin is properly closed if the "normal" way of closing isn't used
      if (
        oldHandle &&
        typeof oldHandle.closeFunction === 'function' &&
        (this.moveHandle === null ||
          this.moveHandle.plugin !== oldHandle.plugin)
      ) {
        oldHandle.closeFunction(false)
      }
      // Make sure the element is properly updated.
      this.moveHandleKey += 1
    },
  },
  mounted() {
    const map = api.map.createMap(
      {
        target: this.$refs['polar-map-container'],
        ...mapZoomOffset(this.mapConfiguration),
      },
      '2D',
      {
        mapParams: {
          interactions: defaults({
            altShiftDragRotate: false,
            pinchRotate: false,
            dragPan: false,
            mouseWheelZoom: false,
          }),
        },
      }
    )
    this.setMap(map)
    this.mapConfiguration.locales?.forEach?.((locale: Locale) =>
      i18next.addResourceBundle(locale.type, 'common', locale.resources, true)
    )
    i18next.on('languageChanged', (lang) => (this.lang = lang))
  },
  methods: {
    ...mapMutations(['setMap']),
  },
})
</script>

<style lang="scss">
.polar-shadow {
  height: 100%;
  width: 100%;
}
.v-tooltip__content {
  background-color: #595959;
  border: 2px solid #fff;
}
.v-application {
  font-family: sans-serif !important;
}
.v-list-item--highlighted {
  outline: 2px solid var(--polar-primary);
  outline-offset: -2px;
}
/* Override v-app default styling (must be global to take effect) */
.polar-wrapper .v-application--wrap {
  min-height: initial;
  max-height: 100%;
  width: 100%;
  height: 100%;
  position: relative;
}
.polar-wrapper.v-application .v-btn:focus {
  border: solid var(--polar-primary-contrast) !important;
  outline: solid var(--polar-primary);
  outline-offset: 1px;
}
.polar-wrapper.v-application .v-btn:hover {
  border: solid var(--polar-primary-contrast) !important;
  outline: solid var(--polar-primary);
  outline-offset: 1px;
}
</style>
