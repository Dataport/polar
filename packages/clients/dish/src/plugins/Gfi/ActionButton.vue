<template>
  <v-btn
    v-if="exportProperty"
    class="text-none dish-export-button"
    text
    :href="exportProperty"
    target="_blank"
    :alt="$t('plugins.gfi.property.imageAlt')"
    :title="$t('plugins.gfi.property.linkTitle')"
    :aria-label="$t('plugins.gfi.property.export')"
    onmousedown="return false"
  >
    <v-icon small>fa-download</v-icon>
    {{ $t('plugins.gfi.property.export') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'DishActionButton',
  computed: {
    ...mapGetters('plugin/gfi', ['exportProperty']),
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
