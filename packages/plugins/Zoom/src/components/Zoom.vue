<template>
  <div class="polar-zoom-wrap">
    <v-tooltip v-if="showZoomButtons" left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <v-btn
          :aria-label="$t('common:plugins.zoom.in')"
          :class="
            renderType === 'iconMenu'
              ? `polar-zoom-dependent${deviceIsHorizontal ? '-horizontal' : ''}`
              : 'ma-2'
          "
          :style="buttonStyle"
          small
          fab
          :disabled="maximumZoomLevelActive"
          v-bind="attrs"
          @click="increaseZoomLevel"
          v-on="on"
        >
          <v-icon :style="iconStyle"> fa-plus </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common:plugins.zoom.in') }}</span>
    </v-tooltip>
    <v-tooltip v-if="showZoomButtons" left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <v-btn
          :aria-label="$t('common:plugins.zoom.out')"
          :class="{ 'ma-2': renderType === 'independent' }"
          :style="buttonStyle"
          small
          fab
          :disabled="minimumZoomLevelActive"
          v-bind="attrs"
          @click="decreaseZoomLevel"
          v-on="on"
        >
          <v-icon :style="iconStyle"> fa-minus </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common:plugins.zoom.out') }}</span>
    </v-tooltip>
    <v-tooltip v-if="addZoomSlider" left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <ZoomSlider></ZoomSlider>
        </div>
      </template>
      <span>{{ $t('common:plugins.zoom.slider') }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ZoomSlider from './ZoomSlider.vue'

export default Vue.extend({
  name: 'PolarZoom',
  components: { ZoomSlider },
  computed: {
    ...mapGetters(['deviceIsHorizontal', 'hasSmallDisplay', 'hasSmallHeight']),
    ...mapGetters('plugin/zoom', [
      'maximumZoomLevelActive',
      'minimumZoomLevelActive',
      'renderType',
      'showMobile',
      'showZoomSlider',
    ]),
    addZoomSlider(): boolean {
      return !this.hasSmallHeight && this.showZoomSlider
    },
    buttonStyle() {
      return `
        background-color: var(--polar-primary) !important;
        border-color: var(--polar-primary);
        color: var(--polar-primary-contrast);
      `
    },
    iconStyle() {
      return `color: var(--polar-primary-contrast);`
    },
    showZoomButtons(): boolean {
      return this.hasSmallHeight ? this.showMobile : true
    },
  },
  methods: {
    ...mapActions('plugin/zoom', ['increaseZoomLevel', 'decreaseZoomLevel']),
  },
})
</script>

<style lang="scss" scoped>
.polar-zoom-dependent-horizontal {
  margin-left: 0.5rem;
}

.polar-zoom-dependent {
  margin-bottom: 0.5rem;
}
.polar-zoom-wrap {
  display: flex;
  flex-direction: column;
}
</style>
