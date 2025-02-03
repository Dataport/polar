<template>
  <v-btn
    class="buttonSecondary"
    x-small
    fab
    color="secondary"
    :title="
      $t(
        `common:plugins.attributions.button.${
          windowIsOpen ? 'close' : 'open'
        }Title`
      )
    "
    @click="toggleMapInfo"
  >
    <v-icon color="secondaryContrast">{{ mapInfoIcon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'AttributionButton',
  computed: {
    ...mapGetters('plugin/attributions', ['mapInfoIcon', 'windowIsOpen']),
  },
  methods: {
    ...mapMutations('plugin/attributions', ['setWindowIsOpen']),
    toggleMapInfo() {
      this.setWindowIsOpen(!this.windowIsOpen)
    },
  },
})
</script>

<style scoped lang="scss">
.buttonSecondary.v-btn:hover {
  border: solid var(--polar-secondary-contrast) !important;
  outline: solid var(--polar-secondary);
  outline-offset: 1px;
}
.buttonSecondary.v-btn:focus {
  border: solid var(--polar-secondary-contrast) !important;
  outline: solid var(--polar-secondary);
  outline-offset: 1px;
}
</style>
