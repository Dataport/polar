<template>
  <v-scroll-x-reverse-transition>
    <v-card id="polar-plugin-routing-card">
      <v-card-title>{{ $t('plugins.routing.title') }}</v-card-title>
      <!-- TODO: Add the styling to the <style> tag -->
      <div
        v-for="(_, index) in route"
        :key="`route-container-${index}`"
        style="display: flex; align-items: center; gap: 1.5em"
      >
        <!-- TODO: This should display the address if reverse geocoding is configured -->
        <v-text-field
          v-model="route[index]"
          :label="$t(getRouteLabel(index))"
          :aria-label="$t(getRouteLabel(index))"
          @input="search"
          @focus="setCurrentlyFocusedInput(index)"
        />
        <div>
          <v-btn
            icon
            small
            :disabled="addWaypointButtonDisabled"
            @click="setRoute({ index })"
          >
            <v-icon small>fa-plus</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            :disabled="route.length === 2"
            @click="setRoute({ index, remove: true })"
          >
            <v-icon small>fa-minus</v-icon>
          </v-btn>
        </div>
      </div>
      <v-list v-if="false" class="dropdown">
        <v-list-item
          v-for="(result, index) in searchResults"
          :key="index"
          @click="selectEnd(result)"
        >
          <span>
            {{ result.strassenname }}
            <template v-if="result.hausnummer">
              {{ result.hausnummer }}
            </template>
          </span>
        </v-list-item>
      </v-list>
      <RoutingOptions />
      <div id="polar-plugin-routing-button-group">
        <v-btn :aria-label="$t('plugins.routing.resetButton')" @click="reset">
          {{ $t('plugins.routing.resetButton') }}
        </v-btn>
        <v-btn
          :aria-label="$t('plugins.routing.routeDetails')"
          :disabled="Object.keys(routingResponseData).length === 0"
          @click="updateShowSteps"
        >
          {{ $t('plugins.routing.routeDetails') }}
        </v-btn>
      </div>
      <RoutingDetails />
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import RoutingDetails from './RoutingDetails.vue'
import RoutingOptions from './RoutingOptions.vue'

export default Vue.extend({
  name: 'PolarRouting',
  components: {
    RoutingDetails,
    RoutingOptions,
  },
  computed: {
    ...mapGetters('plugin/routing', [
      'route',
      'routingResponseData',
      'searchResults',
      'selectedPreference',
      'selectedRouteTypesToAvoid',
      'selectedTravelMode',
    ]),
    addWaypointButtonDisabled() {
      return (
        this.route.filter((part) => Boolean(part.length)).length <
        this.route.length - 1
      )
    },
    routeIncomplete() {
      return this.route.some((part) => part.length === 0)
    },
  },
  watch: {
    route() {
      if (!this.routeIncomplete) {
        this.getRoute()
      }
    },
    selectedRouteTypesToAvoid() {
      if (!this.routeIncomplete) {
        this.getRoute()
      }
    },
    selectedPreference() {
      if (!this.routeIncomplete) {
        this.getRoute()
      }
    },
  },
  beforeDestroy() {
    this.setCurrentlyFocusedInput(-1)
  },
  methods: {
    ...mapActions('plugin/routing', [
      'getRoute',
      'reset',
      'search',
      'setCurrentlyFocusedInput',
    ]),
    ...mapMutations('plugin/routing', ['setRoute', 'updateShowSteps']),
    getRouteLabel(index: number) {
      return `plugins.routing.label.${
        index === 0
          ? 'start'
          : index === this.route.length - 1
          ? 'end'
          : 'middle'
      }`
    },
  },
})
</script>

<style lang="scss">
#polar-plugin-routing-card {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;

  #polar-plugin-routing-button-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;

    .v-btn {
      width: 45%;
    }
  }
}

.dropdown {
  max-height: 300px;
  overflow-y: auto; /* enables scrolling */
  border: 1px solid #ccc;
  background-color: #fff;
}
</style>
