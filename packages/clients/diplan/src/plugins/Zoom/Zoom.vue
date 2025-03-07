<template>
  <div class="polar-zoom-wrap">
    <v-tooltip v-if="showZoomButtons" left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <v-btn
          :aria-label="$t('plugins.zoom.in')"
          class="ma-2 mb-1"
          color="primaryContrast"
          small
          width="40"
          height="40"
          :disabled="maximumZoomLevelActive"
          v-bind="attrs"
          @click="increaseZoomLevel"
          v-on="on"
        >
          <v-icon color="primary"> {{ icons.zoomIn }} </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('plugins.zoom.in') }}</span>
    </v-tooltip>
    <v-tooltip v-if="showZoomButtons" left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <v-btn
          :aria-label="$t('plugins.zoom.out')"
          class="ma-2 mt-1"
          color="primaryContrast"
          small
          width="40"
          height="40"
          :disabled="minimumZoomLevelActive"
          v-bind="attrs"
          @click="decreaseZoomLevel"
          v-on="on"
        >
          <v-icon color="primary"> {{ icons.zoomOut }} </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('plugins.zoom.out') }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'PolarZoom',
  computed: {
    ...mapGetters(['hasSmallDisplay', 'hasSmallHeight']),
    ...mapGetters('plugin/zoom', [
      'icons',
      'maximumZoomLevelActive',
      'minimumZoomLevelActive',
      'showMobile',
    ]),
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

  .v-btn::before {
    background-color: transparent;
  }
  button {
    border: solid transparent;
    padding: 0 !important;
    min-width: 0 !important;
  }
}
</style>
