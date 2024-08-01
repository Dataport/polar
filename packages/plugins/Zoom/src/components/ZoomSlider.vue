<template>
  <v-slider
    v-model="zoomLevelRange"
    vertical
    class="polar-zoom-slider"
    :min="minimumZoomLevel"
    :max="maximumZoomLevel"
    :aria-label="$t('common:plugins.zoom.slider')"
  ></v-slider>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'ZoomSlider',
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
.polar-zoom-slider .v-slider__thumb::before {
  opacity: 0;
}

.polar-zoom-slider .v-slider__thumb {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  left: -8px;
}

.polar-zoom-slider :hover .v-slider__track-background,
.polar-zoom-slider :hover .v-slider__track-fill,
.polar-zoom-slider :hover .v-slider__thumb,
.polar-zoom-slider :focus .v-slider__thumb {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #003064;
}

.polar-zoom-slider .v-slider--vertical {
  .v-slider__track-container,
  .v-slider__track-fill,
  .v-slider__track-background {
    width: 12px;
    border-radius: 2px;
  }
}
</style>
