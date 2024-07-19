<template>
  <component :is="layout" class="map-ui" />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { getLayout } from '../utils/layout'

export default Vue.extend({
  data: (): { resizeObserver: null | ResizeObserver } => ({
    resizeObserver: null,
  }),
  computed: {
    ...mapGetters(['components']),
    layout() {
      return getLayout() // not reactive
    },
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.updateClientDimensions)
    this.resizeObserver.observe(this.$root.$el)
    this.updateClientDimensions()
  },
  beforeUnmount() {
    if (this.resizeObserver instanceof ResizeObserver) {
      this.resizeObserver.unobserve(this.$root.$el)
    }
  },
  methods: {
    ...mapMutations(['setClientWidth', 'setClientHeight']),
    updateClientDimensions() {
      this.setClientWidth(this.$root.$el.clientWidth)
      this.setClientHeight(this.$root.$el.clientHeight)
    },
  },
})
</script>

<style lang="scss" scoped>
.map-ui {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.map-ui > .nine-layout {
  max-width: 100%;
}
</style>
