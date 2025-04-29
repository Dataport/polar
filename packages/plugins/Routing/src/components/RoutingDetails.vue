<template>
  <div>
    <v-btn
      :aria-label="$t('plugins.routing.routeDetails')"
      @click="showSteps = !showSteps"
    >
      {{ $t('plugins.routing.routeDetails') }}
    </v-btn>
    <div
      v-if="showSteps && Object.keys(routingResponseData).length !== 0"
      class="details-container"
    >
      {{ $t('plugins.routing.duration') }}
      {{ formatDuration(searchResponseTotalValues[0].duration) }} &nbsp;
      {{ $t('plugins.routing.distance') }}
      {{ formatDistance(searchResponseTotalValues[0].distance) }}
      <v-list
        v-for="(step, i) in searchResponseSegments"
        :key="i"
        class="detail-list"
      >
        <v-list-item>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'RoutingDetails',
  data: () => ({ showSteps: false }),
  computed: {
    ...mapGetters('plugin/routing', ['routingResponseData']),
    searchResponseSegments: {
      get(): object {
        return this.routingResponseData.features[0].properties.segments[0].steps
      },
    },
    searchResponseTotalValues: {
      get(): object {
        return this.routingResponseData.features[0].properties.segments
      },
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
button {
  width: 100%;
}
.details-container {
  max-height: 300px;
  overflow-y: auto; /* enables scrolling */
  padding-top: 10px;
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
}
.detail-list {
  text-align: left;
}
@media (max-width: 600px) {
  .details-container {
    max-width: 95%;
    max-height: 400px;
    padding: 5px;
  }

  .detail-list {
    font-size: 14px;
  }

  v-list-item-title {
    font-size: 16px;
    font-weight: bold;
  }

  v-list-item-subtitle {
    font-size: 14px;
  }
}
</style>
