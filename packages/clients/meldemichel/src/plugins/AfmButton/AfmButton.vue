<template>
  <v-tooltip :left="!hasSmallWidth" :top="hasSmallWidth">
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="afmUrl"
        :target="mapStateReady ? '_blank' : ''"
        color="primary"
        class="meldemichel-afm-button"
        :href="mapStateReady ? afmUrl : '#'"
        large
        v-bind="attrs"
        @click="click"
        @keydown.space="click"
        v-on="on"
      >
        <v-icon small>fa-map-location</v-icon>
        {{ $t('common:plugins.meldemichel.afmButton.buttonText') }}
      </v-btn>
    </template>
    <span>{{ $t('common:plugins.meldemichel.afmButton.hint') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'MeldemichelAfmButton',
  computed: {
    ...mapGetters(['configuration', 'hasSmallWidth']),
    ...mapGetters('meldemichel', ['mapState']),
    mapStateReady() {
      return Boolean(
        this.mapState && !Object.values(this.mapState).includes(undefined)
      )
    },
    afmUrl() {
      const url = this.configuration.meldemichel.afmButton.afmUrl
      if (!url) {
        console.error(
          'Missing afmUrl parameter in `configuration.meldemichel.afmButton.afmUrl`.'
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
          text: 'plugins.meldemichel.afmButton.missingAddress',
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
  pointer-events: initial;

  .v-btn__content {
    align-items: baseline;

    .v-icon {
      margin-right: 0.5em;
    }
  }
}
</style>
