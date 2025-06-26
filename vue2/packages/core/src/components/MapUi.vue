<template>
  <component :is="layout" class="map-ui" />
</template>

<script lang="ts">
import Vue from 'vue'
import { getLayout } from '../utils/layout'

export default Vue.extend({
  computed: {
    layout() {
      return getLayout() // not reactive
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
