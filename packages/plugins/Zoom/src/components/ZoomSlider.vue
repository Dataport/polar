<template>
  <div>
    <v-slider
      v-model="zoomLevelRange"
      vertical
      class="polar-zoom-slider"
      :min="minimumZoomLevel"
      :max="maximumZoomLevel"
      :title="$t('common:plugins.zoom.slider')"
      :aria-label="$t('common:plugins.zoom.slider')"
    ></v-slider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'ZoomSlider',
  props: {
    minZoom: {
      type: Number,
      default: 0,
    },
    maxZoom: {
      type: Number,
      default: 9,
    },
  },
  computed: {
    ...mapGetters('plugin/zoom', [
      'zoomLevel',
      'maximumZoomLevel',
      'minimumZoomLevel',
    ]),
    zoomLevelRange: {
      get(): number {
        return this.zoomLevel
      },
      set(value: number): void {
        this.setZoomLevel(value)
      },
    },
  },
  methods: {
    ...mapActions('plugin/zoom', ['setZoomLevel']),
  },
})
</script>

<style lang="scss">
.v-slider--focused,
.v-slider__thumb::before {
  display: none;
}

.v-slider__thumb {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  left: -8px;
}
.v-slider__thumb-container:hover .v-slider__thumb {
  width: 16px;
  height: 16px;
  left: -8px;
}

.v-slider--vertical {
  .v-slider__track-container,
  .v-slider__track-fill,
  .v-slider__track-background {
    width: 12px;
    border-radius: 2px;
  }
}
</style>
