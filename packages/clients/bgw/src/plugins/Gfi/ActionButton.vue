<template>
  <v-btn
    class="text-none bgw-link-button"
    text
    :href="link"
    target="_blank"
    :title="$t('plugins.gfi.button.details')"
    :aria-label="$t('plugins.gfi.button.details')"
    onmousedown="return false"
  >
    {{ $t('plugins.gfi.button.details') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'ActionButton',
  computed: {
    ...mapGetters('plugin/gfi', ['currentProperties']),
    link() {
      return `https://www.schleswig-holstein.de/DE/fachinhalte/B/badegewaesser/DarstellungBadestelle.html#bgst=${this.currentProperties.fid}`
    },
  },
})
</script>
<style lang="scss" scoped>
.bgw-link-button {
  margin-right: 0.4em;
  margin-top: 0.5em;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  border: 3px solid transparent;
}
</style>
