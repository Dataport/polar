<template>
  <v-tooltip v-if="linkConfig" left>
    <template #activator="{ on, attrs }">
      <v-btn
        class="ma-2"
        color="primaryContrast"
        :href="linkConfig.href"
        :aria-label="$t(linkConfig.label)"
        small
        width="40"
        height="40"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon color="primary">{{ linkConfig.icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ $t(linkConfig.label) }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'MeldemichelAfmButton',
  computed: {
    ...mapGetters(['configuration']),
    linkConfig() {
      const link = this.configuration.diplan.link
      if (!link) {
        console.error(
          '@polar/client-diplan: Missing configuration for diplan.link.'
        )
        return null
      }
      return link
    },
  },
})
</script>

<style lang="scss" scoped>
.v-btn::before {
  background-color: transparent;
}
.v-btn {
  border: solid transparent;
  pointer-events: initial;
  padding: 0 !important;
  min-width: 0 !important;
}
</style>
