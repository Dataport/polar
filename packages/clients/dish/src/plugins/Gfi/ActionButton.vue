<template>
  <v-btn
    v-if="exportProperty"
    class="text-none dish-export-button"
    text
    :href="exportProperty"
    target="_blank"
    :alt="$t('common:plugins.gfi.property.imageAlt')"
    :title="$t('common:plugins.gfi.property.linkTitle')"
    :aria-label="$t('common:plugins.gfi.property.export')"
    onmousedown="return false"
  >
    <v-icon small>fa-download</v-icon>
    {{ $t('common:plugins.gfi.property.export') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DishActionButton',
  props: {
    exportProperty: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped lang="scss">
.dish-export-button {
  .v-icon {
    margin-right: 0.4em;
  }
}
</style>
