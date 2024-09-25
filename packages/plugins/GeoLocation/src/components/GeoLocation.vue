<template>
  <div>
    <v-tooltip left :disabled="hasSmallDisplay">
      <template #activator="{ on, attrs }">
        <v-btn
          :class="{
            'ma-2': renderType !== 'iconMenu',
          }"
          :style="buttonStyle"
          small
          fab
          :disabled="isGeolocationDenied"
          v-bind="attrs"
          v-on="on"
          @click="geolocation === null ? track() : untrack()"
        >
          <v-icon :style="iconStyle">fa-map-pin</v-icon>
        </v-btn>
      </template>
      <span>{{ $t(tooltipMessage) }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'GeoLocation',
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/geoLocation', [
      'geolocation',
      'renderType',
      'tracking',
      'isGeolocationDenied',
    ]),
    buttonStyle() {
      return `
        background-color: var(--polar-primary) !important;
        border-color: var(--polar-primary);
        color: var(--polar-primary-contrast);
      `
    },
    iconStyle() {
      return `color: var(--polar-primary-contrast);`
    },
    tooltipMessage() {
      if (this.isGeolocationDenied) {
        return 'common:plugins.geoLocation.button.tooltip.locationAccessDenied'
      }
      if (this.tracking) {
        return 'common:plugins.geoLocation.button.tooltip.removeLocationMarker'
      }
      return 'common:plugins.geoLocation.button.tooltip.placeLocationMarker'
    },
  },
  methods: {
    ...mapActions('plugin/geoLocation', ['track', 'untrack']),
  },
})
</script>

<style lang="scss" scoped></style>
