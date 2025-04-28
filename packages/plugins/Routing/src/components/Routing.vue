<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-routing-menu">
      <v-card-title>{{ $t('common:plugins.routing.title') }}</v-card-title>
      <!-- TODO: Add the styling to the <style> tag -->
      <div
        v-for="(_, index) in route"
        :key="`route-container-${index}`"
        style="display: flex; align-items: center; gap: 1.5em"
      >
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
      <!-- Selectable Options -->
      <v-select
        v-model="selectedTravelModeItem"
        class="select"
        :label="$t('plugins.routing.label.mode')"
        :aria-label="$t('plugins.routing.label.mode')"
        :items="travelModes"
        item-value="key"
        item-text="translatedKey"
      ></v-select>

      <v-select
        v-if="displayPreferences"
        v-model="selectedPreferenceItem"
        class="select"
        :label="$t('plugins.routing.label.preference')"
        :aria-label="$t('plugins.routing.label.preference')"
        :items="preferences"
        item-value="key"
        item-text="translatedKey"
      ></v-select>

      <div v-if="displayRouteTypesToAvoid">
        <p class="align-center">
          {{ $t('common:plugins.routing.avoidRoutesTitle') }}
        </p>
        <div class="checkbox-container">
          <v-checkbox
            v-for="(routeType, i) in RouteTypesToAvoidForSelectedProfile"
            :key="i"
            v-model="selectedRouteTypesToAvoidItem"
            :label="$t(translatedRouteTypeToAvoid(routeType['key']))"
            :aria-label="$t(translatedRouteTypeToAvoid(routeType['key']))"
            :value="routeType['key']"
          ></v-checkbox>
        </div>
      </div>

      <!-- Send Button -->
      <v-tooltip left :disabled="!areFieldsMissing">
        <template #activator="{ on }">
          <div v-on="on">
            <v-btn
              class="sendButton"
              :aria-label="$t('common:plugins.routing.sendRequestButton')"
              :disabled="areFieldsMissing"
              @click="getRoute"
            >
              {{ $t('common:plugins.routing.sendRequestButton') }}
            </v-btn>
          </div>
        </template>
        <span>{{ $t('common:plugins.routing.toolTip') }}</span>
      </v-tooltip>
      <v-btn :aria-label="$t('plugins.routing.resetButton')" @click="reset">
        {{ $t('plugins.routing.resetButton') }}
      </v-btn>

      <!-- Route Details Button -->
      <v-btn
        :aria-label="$t('common:plugins.routing.routeDetails')"
        @click="showSteps = !showSteps"
      >
        {{ $t('common:plugins.routing.routeDetails') }}
      </v-btn>

      <!-- List of Route Segments -->
      <div
        v-if="showSteps && Object.keys(routingResponseData).length !== 0"
        class="details-container"
      >
        {{ $t('common:plugins.routing.duration') }}
        {{ formatDuration(searchResponseTotalValues[0].duration) }} &nbsp;
        {{ $t('common:plugins.routing.distance') }}
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
                {{ $t('common:plugins.routing.distance') }}
                {{ formatDistance(step['distance']) }},
                {{ $t('common:plugins.routing.duration') }}
                {{ formatDuration(step['duration']) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import { t } from 'i18next'
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'PolarRouting',
  data: () => ({ showSteps: false }),
  computed: {
    ...mapGetters('plugin/routing', [
      'displayPreferences',
      'displayRouteTypesToAvoid',
      'selectableRouteTypesToAvoid',
      'selectedRouteTypesToAvoid',
      'selectedTravelMode',
      'selectedPreference',
      'searchResults',
      'routingResponseData',
      'route',
    ]),
    addWaypointButtonDisabled() {
      return (
        this.route.filter((part) => Boolean(part.length)).length <
        this.route.length - 1
      )
    },
    preferences() {
      return ['recommended', 'fastest', 'shortest'].map((key) => ({
        key,
        translatedKey: t(`plugins.routing.preference.${key}`),
      }))
    },
    travelModes() {
      return [
        {
          key: 'driving-car',
          translatedKey: t('plugins.routing.travelMode.car'),
        },
        {
          key: 'driving-hgv',
          translatedKey: t('plugins.routing.travelMode.hgv'),
        },
        {
          key: 'cycling-regular',
          translatedKey: t('plugins.routing.travelMode.bike'),
        },
        {
          key: 'foot-walking',
          translatedKey: t('plugins.routing.travelMode.walking'),
        },
        {
          key: 'wheelchair',
          translatedKey: t('plugins.routing.travelMode.wheelchair'),
        },
      ]
    },
    selectedTravelModeItem: {
      get(): string {
        return this.selectedTravelMode
      },
      set(value: string): void {
        this.setSelectedTravelMode(value)
      },
    },
    selectedPreferenceItem: {
      get(): string {
        return this.selectedPreference
      },
      set(value: string): void {
        this.setSelectedPreference(value)
      },
    },
    selectedRouteTypesToAvoidItem: {
      get(): string {
        return this.selectedRouteTypesToAvoid
      },
      set(value: string): void {
        this.setSelectedRouteTypesToAvoid(value)
      },
    },
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
    RouteTypesToAvoidForSelectedProfile() {
      let availableOptions = []
      if (
        this.selectedTravelMode === 'driving-car' ||
        this.selectedTravelMode === 'driving-hgv' ||
        this.selectedTravelMode === ''
      ) {
        availableOptions = this.selectableRouteTypesToAvoid
      } else {
        availableOptions = [
          {
            key: 'ferries',
            locale: 'common:plugins.routing.avoidRoutes.ferries',
          },
        ]
      }
      return availableOptions
    },
    areFieldsMissing() {
      const routeNotComplete = this.route.some((part) => part.length === 0)
      const isSelectedTravelModeMissing = this.selectedTravelMode === ''
      const isSelectedPreferenceMissing = this.selectedPreference === ''
      return Boolean(
        routeNotComplete ||
          isSelectedTravelModeMissing ||
          isSelectedPreferenceMissing
      )
    },
  },
  watch: {
    selectedTravelMode() {
      this.selectedRouteTypesToAvoidItem = []
    },
  },
  methods: {
    ...mapActions('plugin/routing', ['getRoute', 'resetCoordinates', 'search']),
    ...mapMutations('plugin/routing', [
      'setCurrentlyFocusedInput',
      'setRoute',
      'setSelectedTravelMode',
      'setSelectedPreference',
      'setSelectedRouteTypesToAvoid',
    ]),
    getRouteLabel(index: number) {
      return `plugins.routing.label.${
        index === 0
          ? 'start'
          : index === this.route.length - 1
          ? 'end'
          : 'middle'
      }`
    },
    reset() {
      this.showSteps = false
      this.resetCoordinates()
    },
    translatedRouteTypeToAvoid(myKey) {
      return this.selectableRouteTypesToAvoid.find(
        (element) => element.key === myKey
      ).locale
    },
    formatDistance(distance) {
      if (distance >= 1000) {
        return `${(distance / 1000).toFixed(1)} km`
      }
      return `${distance} m`
    },
    formatDuration(duration) {
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

<style lang="scss">
.polar-routing-menu {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.text-field {
  width: 65%;
}
.dropdown {
  max-height: 300px;
  overflow-y: auto; /* enables scrolling */
  border: 1px solid #ccc;
  background-color: #fff;
}
.select {
  width: 65%;
}
.checkbox-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  justify-content: space-evenly;
}
@media (max-width: 600px) {
  .checkbox-container {
    flex-direction: column;
    align-items: center;
  }
}
.sendButton {
  margin-bottom: 20px;
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
