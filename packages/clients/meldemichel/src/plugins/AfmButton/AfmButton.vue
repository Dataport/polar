<template>
  <v-btn
    v-if="afmUrl"
    :target="mapStateReady ? '_blank' : ''"
    color="primary"
    class="meldemichel-afm-button"
    :href="mapStateReady ? afmUrl : '#'"
    large
    @click="click"
  >
    <v-icon small>fa-map-location</v-icon>
    {{ $t('common:plugins.meldemichelAfmButton.buttonText') }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'MeldemichelAfmButton',
  computed: {
    ...mapGetters(['configuration']),
    ...mapGetters('meldemichel', ['mapState']),
    mapStateReady() {
      return Boolean(
        this.mapState && !Object.values(this.mapState).includes(undefined)
      )
    },
    afmUrl() {
      const url = this.configuration.meldemichelAfmButton.afmUrl
      if (!url) {
        console.error(
          'Missing afmUrl parameter in `configuration.meldemichelAfmButton.afmUrl`.'
        )
        return ''
      }
      return `${url}?${Object.entries(this.mapState)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}&charset=utf-8`
    },
  },
  methods: {
    click() {
      if (!this.mapStateReady) {
        this.$store.dispatch('plugin/toast/addToast', {
          type: 'info',
          text: 'plugins.meldemichelAfmButton.missingAddress',
          timeout: 10000,
        })
      }
    },
  },
})
</script>

<style lang="scss">
.meldemichel-afm-button {
  margin: 0 4px 4px 0;
  border: solid transparent;

  .v-btn__content {
    align-items: baseline;

    .v-icon {
      margin-right: 0.5em;
    }
  }
}
</style>
