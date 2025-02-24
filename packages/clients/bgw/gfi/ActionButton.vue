<template>
  <v-btn
    class="text-none bgw-export-button"
    text
    :href="downloadLink"
    target="_blank"
    title="Details der Badestelle"
    aria-label="Details der Badestelle"
    onmousedown="return false"
  >
    Details der Badestelle
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'ActionButton',
  computed: {
    ...mapGetters('plugin/gfi', ['currentProperties']),
    downloadLink() {
      return `https://www.schleswig-holstein.de/DE/fachinhalte/B/badegewaesser/DarstellungBadestelle.html#bgst=${this.currentProperties.fid}`
    },
  },
})
</script>
<style lang="scss" scoped>
.bgw-export-button {
  margin-right: 0.4em;
  margin-top: 0.5em;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  border: 3px solid transparent;
}
</style>
