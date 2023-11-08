<template>
  <div>
    <v-tooltip class="polar-geo-location-wrap" left>
      <template #activator="{ on, attrs }">
        <v-btn
          class="ma-2"
          color="primary"
          small
          fab
          :disabled="isGeolocationDenied"
          v-bind="attrs"
          v-on="on"
          @click="geolocation === null ? track() : untrack()"
        >
          <v-icon color="primaryContrast">fa-map-pin</v-icon>
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
    ...mapGetters('plugin/geoLocation', [
      'geolocation',
      'tracking',
      'isGeolocationDenied',
    ]),
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

<style lang="scss" scoped>
.polar-geo-location-wrap {
  display: flex;
  flex-direction: column;
}
</style>
