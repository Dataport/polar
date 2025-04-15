<template>
  <v-app class="polar-wrapper" :lang="lang">
    <transition name="fade">
      <div
        v-if="!hasWindowSize && (noControlOnZoom || oneFingerPan)"
        class="polar-map-overlay"
      >
        <template v-if="noControlOnZoom">
          {{ $t(overlayLocale) }}
        </template>
        <template v-else-if="oneFingerPan">
          {{ $t('overlay.oneFingerPan') }}
        </template>
      </div>
    </transition>
    <div
      ref="polar-map-container"
      class="polar-map"
      tabindex="0"
      role="region"
      :aria-label="$t('canvas.label')"
    ></div>
    <MapUi></MapUi>
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
import api from '@masterportal/masterportalapi/src/maps/api'
import { MoveHandle } from '@polar/components'
import {
  Locale,
  MapConfig,
  MoveHandleProperties,
} from '@polar/lib-custom-types'
import Hammer from 'hammerjs'
import i18next from 'i18next'
import { defaults } from 'ol/interaction'
import Vue, { PropType } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { addClusterStyle } from '../utils/addClusterStyle'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import { mapZoomOffset } from '../utils/mapZoomOffset'
import { setupStyling } from '../utils/setupStyling'
import MapUi from './MapUi.vue'
// NOTE: OpenLayers styles need to be imported as the map resides in the shadow DOM
import 'ol/ol.css'

const isMacOS = navigator.userAgent.indexOf('Mac') !== -1

export default Vue.extend({
  components: {
    MapUi,
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
    noControlOnZoom: boolean
    noControlOnZoomTimeout: number | undefined
    oneFingerPan: boolean
    oneFingerPanTimeout: number | undefined
  } => ({
    lang: 'de',
    moveHandleKey: 0,
    noControlOnZoom: false,
    noControlOnZoomTimeout: undefined,
    oneFingerPan: false,
    oneFingerPanTimeout: undefined,
  }),
  computed: {
    ...mapGetters([
      'hasSmallDisplay',
      'hasSmallWidth',
      'hasWindowSize',
      'map',
      'moveHandle',
      'moveHandleActionButton',
    ]),
    overlayLocale() {
      return `overlay.${isMacOS ? 'noCommandOnZoom' : 'noControlOnZoom'}`
    },
    renderMoveHandle() {
      return (
        this.moveHandle !== null && this.hasWindowSize && this.hasSmallWidth
      )
    },
  },
  watch: {
    // NOTE: Updates can happen if a user resizes the window or the fullscreen plugin is used.
    //       Added as a watcher to trigger the update at the correct time.
    hasWindowSize(newVal) {
      this.updateDragAndZoomInteractions()
      this.updateListeners(newVal)
    },
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
        ...mapZoomOffset(
          this.mapConfiguration.extendedMasterportalapiMarkers
            ? addClusterStyle(this.mapConfiguration)
            : this.mapConfiguration
        ),
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
    setupStyling(this.mapConfiguration, map)
    this.setMap(map)
    this.updateDragAndZoomInteractions()
    if (this.mapConfiguration.extendedMasterportalapiMarkers) {
      this.useExtendedMasterportalapiMarkers(
        this.mapConfiguration.extendedMasterportalapiMarkers
      )
    }
    this.updateListeners(this.hasWindowSize)
    this.mapConfiguration.locales?.forEach?.((locale: Locale) =>
      i18next.addResourceBundle(locale.type, 'common', locale.resources, true)
    )
    i18next.on('languageChanged', (lang) => (this.lang = lang))
    if (this.mapConfiguration.checkServiceAvailability) {
      this.checkServiceAvailability()
    }
    addEventListener('resize', this.updateHasSmallDisplay)
    this.updateHasSmallDisplay()
  },
  beforeDestroy() {
    removeEventListener('resize', this.updateHasSmallDisplay)
    const mapContainer = this.$refs['polar-map-container']
    if (!this.hasWindowSize && mapContainer) {
      ;(mapContainer as HTMLDivElement).removeEventListener(
        'wheel',
        this.wheelEffect
      )
    }
  },
  methods: {
    ...mapMutations(['setHasSmallDisplay', 'setMap']),
    ...mapActions([
      'checkServiceAvailability',
      'updateDragAndZoomInteractions',
      'useExtendedMasterportalapiMarkers',
    ]),
    updateHasSmallDisplay() {
      this.setHasSmallDisplay(
        window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
          window.innerWidth <= SMALL_DISPLAY_WIDTH
      )
    },
    updateListeners(hasWindowSize: boolean) {
      const mapContainer = this.$refs['polar-map-container']
      if (!hasWindowSize && mapContainer) {
        ;(mapContainer as HTMLDivElement).addEventListener(
          'wheel',
          this.wheelEffect
        )

        if (this.hasSmallDisplay) {
          new Hammer(mapContainer).on('pan', (e) => {
            if (
              e.maxPointers === 1 &&
              !this.map
                .getInteractions()
                .getArray()
                .some((interaction) =>
                  interaction.get('_isPolarDragLikeInteraction')
                )
            ) {
              this.oneFingerPan = true
              setTimeout(() => (this.oneFingerPan = false), 2000)
            }
          })
        }
      }
    },
    wheelEffect(event: WheelEvent) {
      clearTimeout(this.noControlOnZoomTimeout)
      this.noControlOnZoom = isMacOS ? !event.metaKey : !event.ctrlKey
      this.noControlOnZoomTimeout = setTimeout(
        () => (this.noControlOnZoom = false),
        2000
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  .polar-map {
    width: 100%;
    height: 100%;
  }
  .polar-map-overlay {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: inherit;
    height: inherit;
    z-index: 42;
    font-size: 22px;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.45);
    pointer-events: none;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>

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
