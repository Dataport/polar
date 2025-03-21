<template>
  <ZoomButtonContainer />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { ZoomButtonContainer } from '@polar/plugin-zoom'

export default Vue.extend({
  name: 'DiplanZoom',
  components: {
    ZoomButtonContainer,
  },
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
.polar-zoom-wrap {
  :deep(.v-btn::before) {
    background-color: transparent;
  }
  :deep(.v-btn) {
    border: solid transparent !important;
    width: 40px;
    height: 40px;
    background-color: var(--polar-primary-contrast) !important;
    padding: 0 !important;
    min-width: 0 !important;
    border-radius: 4px !important;
  }
  :deep(.v-btn:nth-of-type(1)) {
    margin-bottom: 4px !important;
  }
  :deep(.v-btn:nth-of-type(2)) {
    margin-top: 4px !important;
  }
  :deep(.v-icon) {
    color: var(--polar-primary) !important;
  }
}
</style>
