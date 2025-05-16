<template>
  <AttributionButton class="buttonSecondary v-size--small secondaryContrast" />
</template>

<script lang="ts">
import Vue from 'vue'
import { AttributionButton } from '@polar/plugin-attributions'

export default Vue.extend({
  name: 'DiplanAttributionButton',
  components: {
    AttributionButton,
  },
})
</script>

<style scoped lang="scss">
.v-btn {
  min-width: 0 !important;
  border-radius: 4px !important;

  :deep(.v-icon) {
    color: var(--polar-secondary) !important;
  }
}
</style>
