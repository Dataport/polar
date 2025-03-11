<template>
  <v-btn
    class="buttonSecondary"
    small
    width="40"
    height="40"
    color="secondaryContrast"
    :title="
      $t(`plugins.attributions.button.${windowIsOpen ? 'close' : 'open'}Title`)
    "
    @click="toggleMapInfo"
  >
    <v-icon color="secondary">{{ mapInfoIcon }}</v-icon>
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
button {
  min-width: 0 !important;
}
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
