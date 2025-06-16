<template>
  <div
    v-if="showSteps && Object.keys(routingResponseData).length !== 0"
    class="polar-plugin-routing-details-container"
  >
    {{ $t('plugins.routing.duration') }}
    {{ formatDuration(duration) }} &nbsp;
    {{ $t('plugins.routing.distance') }}
    {{ formatDistance(distance) }}
    <v-list class="polar-plugin-routing-detail-list">
      <v-list-item v-for="(step, i) in steps" :key="i">
        <v-list-item-content>
          <v-list-item-title>
            {{ step['instruction'] }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('plugins.routing.distance') }}
            {{ formatDistance(step['distance']) }},
            {{ $t('plugins.routing.duration') }}
            {{ formatDuration(step['duration']) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'RoutingDetails',
  computed: {
    ...mapGetters('plugin/routing', ['routingResponseData', 'showSteps']),
    distance() {
      return this.segments.reduce((acc, segment) => acc + segment.distance, 0)
    },
    duration() {
      return this.segments.reduce((acc, segment) => acc + segment.duration, 0)
    },
    segments() {
      return this.routingResponseData.features[0].properties.segments
    },
    steps() {
      return this.segments.flatMap((segment) => segment.steps)
    },
  },
  methods: {
    formatDistance(distance: number) {
      if (distance >= 1000) {
        return `${(distance / 1000).toFixed(1)} km`
      }
      return `${distance} m`
    },
    formatDuration(duration: number) {
      if (duration >= 3600) {
        return `${(duration / 3600).toFixed(2)} h`
      } else if (duration >= 60) {
        return `${(duration / 60).toFixed(1)} min`
      }
      return `${duration} sec`
    },
  },
})
</script>

<style scoped lang="scss">
.polar-plugin-routing-details-container {
  max-height: 300px;
  overflow-y: scroll;
  padding-top: 10px;
  text-align: center;
}
.polar-plugin-routing-detail-list {
  text-align: left;
}
</style>
