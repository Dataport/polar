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
    <v-tooltip left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <ZoomSlider v-if="addZoomSlider"></ZoomSlider>
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
    showZoomButtons(): boolean {
      return this.hasSmallHeight ? this.showMobile : true
    },
    addZoomSlider(): boolean {
      return !this.hasSmallHeight && this.showZoomSlider
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
