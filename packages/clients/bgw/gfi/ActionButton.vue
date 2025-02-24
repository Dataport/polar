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
    <v-icon small>fa-download</v-icon>
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
