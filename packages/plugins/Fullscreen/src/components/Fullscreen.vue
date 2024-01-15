<template>
  <v-tooltip
    v-if="fullscreenAvailable"
    :left="!isHorizontal"
    :bottom="isHorizontal"
    :disabled="hasSmallDisplay"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        :aria-label="
          isInFullscreen
            ? $t('common:plugins.fullscreen.button.tooltip.deactivate')
            : $t('common:plugins.fullscreen.button.tooltip.activate')
        "
        :class="{ 'ma-2': renderType === 'independent' }"
        color="primary"
        small
        fab
        v-bind="attrs"
        v-on="on"
        @click="toggleFullscreen"
      >
        <v-icon color="primaryContrast">
          {{ isInFullscreen ? 'fa-compress' : 'fa-expand' }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{
      isInFullscreen
        ? $t('common:plugins.fullscreen.button.tooltip.deactivate')
        : $t('common:plugins.fullscreen.button.tooltip.activate')
    }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'FullscreenPlugin',
  props: {
    isHorizontal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['hasSmallDisplay', 'map']),
    ...mapGetters('plugin/fullscreen', [
      'isInFullscreen',
      'renderType',
      'targetContainerId',
    ]),
    targetContainer(): Element {
      if (this.targetContainerId.length > 0) {
        if (document.getElementById(this.targetContainerId)) {
          return document.getElementById(this.targetContainerId) as HTMLElement
        }
        console.error(
          `@polar/plugin-fullscreen: The given targetContainerId ${this.targetContainerId} does not refer to a valid html element.`
        )
      }
      return this.$root.$el
    },
    fullscreenAvailable(): boolean {
      return Boolean(
        this.targetContainer &&
          (this.targetContainer.requestFullscreen ||
            // @ts-expect-error | 'TS2339: Property 'webkitRequestFullscreen' does not exist on type 'Element'.'; For information refer to https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#browser_compatibility
            this.targetContainer.webkitRequestFullscreen)
      )
    },
  },
  mounted() {
    document.addEventListener('webkitfullscreenchange', this.escapeHandler)
    document.addEventListener('fullscreenchange', this.escapeHandler)
  },
  methods: {
    ...mapMutations('plugin/fullscreen', ['setIsInFullscreen']),
    /**
     * function that gets fired on changes to the fullscreen mode via the F11 or ESC keys.
     * Sets the state variable accordingly.
     */
    escapeHandler(): void {
      this.setIsInFullscreen(this.checkForFullscreen())
    },
    /**
     * checks if the browser is in fullscreen
     * @returns true if the fullscreen is activated
     */
    checkForFullscreen(): boolean {
      return Boolean(
        // @ts-expect-error | Error: 'TS2339: Property 'webkitFullscreenElement' does not exist on type 'Element'.'; For information refer to https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#browser_compatibility
        document.fullscreenElement || document.webkitFullscreenElement
      )
    },
    /**
     * Toggles the fullscreen mode
     * As there is currently only support from Chrome, Edge and FireFox for the FullScreen-API
     * without vendor prefix there must be a case distinction.
     */
    toggleFullscreen(): void {
      if (!this.isInFullscreen) {
        if (this.targetContainer.requestFullscreen) {
          this.targetContainer.requestFullscreen()
          // @ts-expect-error | Error: 'TS2339: Property 'webkitRequestFullscreen' does not exist on type 'Element'.'; For information refer to https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#browser_compatibility
        } else if (this.targetContainer.webkitRequestFullscreen) {
          // @ts-expect-error | 'TS2339: Property 'webkitRequestFullscreen' does not exist on type 'Element'.'; For information refer to https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#browser_compatibility
          this.targetContainer.webkitRequestFullscreen() // iOS Safari
        }
        /* HACK: workaround for edge case
         * 1. user uses F11 to fullscreen whole page
         * 2. user fullscreens map with this plugin
         * Ol doesn't notice resize in this specific situation,
         * but does when normally fullscreening with the plugin.
         */
        setTimeout(() => this.map.updateSize(), 200)
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
        // @ts-expect-error | Error: 'TS2339: Property 'webkitExitFullscreen' does not exist on type 'Element'.'; For information refer to https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#browser_compatibility
      } else if (document.webkitExitFullscreen) {
        // @ts-expect-error | Error: 'TS2339: Property 'webkitExitFullscreen' does not exist on type 'Element'.'; For information refer to https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#browser_compatibility
        document.webkitExitFullscreen() // iOS Safari
      }
      this.setIsInFullscreen(!this.isInFullscreen)
    },
  },
})
</script>
<style lang="scss" scoped></style>
