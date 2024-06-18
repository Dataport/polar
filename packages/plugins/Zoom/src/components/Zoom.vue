<template>
  <div v-if="showZoomButtons" class="polar-zoom-wrap">
    <v-tooltip left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <v-btn
          :aria-label="$t('common:plugins.zoom.in')"
          :class="
            renderType === 'iconMenu'
              ? `polar-zoom-dependent${deviceIsHorizontal ? '-horizontal' : ''}`
              : 'ma-2'
          "
          color="primary"
          small
          fab
          :disabled="maximumZoomLevelActive"
          v-bind="attrs"
          @click="increaseZoomLevel"
          v-on="on"
        >
          <v-icon color="primaryContrast"> fa-plus </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common:plugins.zoom.in') }}</span>
    </v-tooltip>
    <v-tooltip left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <v-btn
          :aria-label="$t('common:plugins.zoom.out')"
          :class="{ 'ma-2': renderType === 'independent' }"
          color="primary"
          small
          fab
          :disabled="minimumZoomLevelActive"
          v-bind="attrs"
          @click="decreaseZoomLevel"
          v-on="on"
        >
          <v-icon color="primaryContrast"> fa-minus </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common:plugins.zoom.out') }}</span>
    </v-tooltip>
    <div v-if="showZoomSlider">
      <zoom-slider
        :aria-label="$t('common:plugins.zoom.slider')"
        :min-zoom="minimumZoomLevel"
        :max-zoom="maximumZoomLevel"
      ></zoom-slider>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ZoomSlider from './ZoomSlider.vue'

export default Vue.extend({
  name: 'PolarZoom',
  components: { ZoomSlider },
  props: {
    isHorizontal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['deviceIsHorizontal', 'hasSmallDisplay', 'hasSmallHeight']),
    ...mapGetters('plugin/zoom', [
      'maximumZoomLevelActive',
      'minimumZoomLevelActive',
      'maximumZoomLevel',
      'minimumZoomLevel',
      'renderType',
      'showMobile',
      'addZoomSlider',
    ]),
    showZoomButtons(): boolean {
      return this.hasSmallHeight ? this.showMobile : true
    },
    showZoomSlider(): boolean {
      return !this.hasSmallHeight && this.addZoomSlider
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
