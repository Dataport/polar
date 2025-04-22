<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-routing-menu">
      <v-card-title>{{ $t('common:plugins.routing.title') }}</v-card-title>

      <!-- Start Point with Dropdown -->
      <div class="text-field" style="position: relative">
        <v-text-field
          v-model="startpointInput"
          :label="$t('common:plugins.routing.startLabel')"
          :aria-label="$t('common:plugins.routing.startLabel')"
          @input="handleAddressSearch('start')"
        ></v-text-field>
        <v-list
          v-if="startSearchResults.length && startDropdownOpen"
          class="dropdown"
        >
          <v-list-item
            v-for="(result, index) in startSearchResults"
            :key="index"
            @click="selectStart(result)"
          >
            <span>
              {{ result.strassenname }}
              <template v-if="result.hausnummer">
                {{ result.hausnummer }}
              </template>
            </span>
          </v-list-item>
        </v-list>
      </div>

      <!-- End Point with Dropdown -->
      <div class="text-field" style="position: relative">
        <v-text-field
          v-model="endpointInput"
          :label="$t('common:plugins.routing.endLabel')"
          :aria-label="$t('common:plugins.routing.endLabel')"
          @input="handleAddressSearch('end')"
        ></v-text-field>
        <v-list
          v-if="endSearchResults.length && endDropdownOpen"
          class="dropdown"
        >
          <v-list-item
            v-for="(result, index) in endSearchResults"
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
      </div>

      <!-- Reset Button -->
      <v-btn
        :aria-label="$t('common:plugins.routing.resetButton')"
        @click="reset"
        >{{ $t('common:plugins.routing.resetButton') }}
      </v-btn>

      <!-- Selectable Options -->
      <v-select
        v-model="selectedTravelModeItem"
        class="select"
        :label="$t('common:plugins.routing.modeLabel')"
        :aria-label="$t('common:plugins.routing.modeLabel')"
        :items="translatedTravelModeOptions"
        item-value="key"
        item-text="translatedKey"
      ></v-select>

      <v-select
        v-if="displayPreferences"
        v-model="selectedPreferenceItem"
        class="select"
        :label="$t('common:plugins.routing.preferenceLabel')"
        :aria-label="$t('common:plugins.routing.preferenceLabel')"
        :items="translatedPreferenceOptions"
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
              @click="sendRequest"
            >
              {{ $t('common:plugins.routing.sendRequestButton') }}
            </v-btn>
          </div>
        </template>
        <span>{{ $t('common:plugins.routing.toolTip') }}</span>
      </v-tooltip>

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
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import debounce from 'lodash.debounce'

export default Vue.extend({
  name: 'PolarRouting',
  data: () => ({
    showSteps: false,
    startDropdownOpen: false,
    endDropdownOpen: false,
    debouncedSendSearchRequest: null as unknown as (payload: string) => void,
  }),
  computed: {
    ...mapGetters('plugin/routing', [
      'selectableTravelModes',
      'displayPreferences',
      'selectablePreferences',
      'displayRouteTypesToAvoid',
      'selectableRouteTypesToAvoid',
      'selectedRouteTypesToAvoid',
      'selectedTravelMode',
      'selectedPreference',
      'searchResults',
      'routingResponseData',
      'start',
      'end',
      'startAddress',
      'endAddress',
    ]),
    startpointInput: {
      get() {
        return this.startAddress ? this.startAddress : this.start
      },
      set(value) {
        this.setStart(value)
      },
    },
    endpointInput: {
      get() {
        return this.endAddress ? this.endAddress : this.end
      },
      set(value) {
        this.setEnd(value)
      },
    },
    startSearchResults() {
      return this.searchResults
        .flatMap((result) => {
          const baseName = result.strassenname
          if (result.hausnummern && result.hausnummern.length > 0) {
            return result.hausnummern.map((hausnummer) => ({
              displayName: `${baseName} ${hausnummer}`,
              ...result,
              hausnummer,
            }))
          }
          return [{ displayName: baseName, ...result }]
        })
        .slice(0, 20)
    },
    endSearchResults() {
      return this.searchResults
        .flatMap((result) => {
          const baseName = result.strassenname
          if (result.hausnummern && result.hausnummern.length > 0) {
            return result.hausnummern.map((hausnummer) => ({
              displayName: `${baseName} ${hausnummer}`,
              ...result,
              hausnummer,
            }))
          }
          return [{ displayName: baseName, ...result }]
        })
        .slice(0, 20)
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
    translatedTravelModeOptions() {
      return this.selectableTravelModes.map((item) => ({
        ...item,
        translatedKey: this.$t(item.localKey),
      }))
    },
    translatedPreferenceOptions() {
      return this.selectablePreferences.map((item) => ({
        ...item,
        translatedKey: this.$t(item.localKey),
      }))
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
            localKey: 'common:plugins.routing.avoidRoutes.ferries',
          },
        ]
      }
      return availableOptions
    },
    areFieldsMissing() {
      const areStartAndStartAddressMissing =
        this.start.length === 0 && this.startAddress === ''
      const areEndAndEndAddressMissing =
        this.end.length === 0 && this.endAddress === ''
      const isSelectedTravelModeMissing = this.selectedTravelMode === ''
      const isSelectedPreferenceMissing = this.selectedPreference === ''
      return Boolean(
        areStartAndStartAddressMissing ||
          areEndAndEndAddressMissing ||
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
  mounted() {
    this.initializeTool()
  },
  created() {
    this.debouncedSendSearchRequest = debounce(this.sendSearchRequest, 300)
  },
  methods: {
    ...mapActions('plugin/routing', [
      'initializeTool',
      'sendRequest',
      'sendSearchRequest',
      'resetCoordinates',
    ]),
    ...mapMutations('plugin/routing', [
      'setStart',
      'setEnd',
      'setStartAddress',
      'setEndAddress',
      'setSelectedTravelMode',
      'setSelectedPreference',
      'setSelectedRouteTypesToAvoid',
    ]),
    handleAddressSearch(inputType) {
      const input =
        inputType === 'start' ? this.startpointInput : this.endpointInput
      if (inputType === 'start') {
        this.startDropdownOpen = true
        this.endDropdownOpen = false
      } else if (inputType === 'end') {
        this.startDropdownOpen = false
        this.endDropdownOpen = true
      }
      this.$nextTick(() => {
        this.debouncedSendSearchRequest({ input, inputType })
      })
    },
    reset() {
      this.showSteps = false
      this.resetCoordinates()
    },
    selectStart(result) {
      if (result.strassenname) {
        this.startpointInput = result.displayName
        this.setStart(result.position)
        this.setStartAddress(result.displayName)
        this.startDropdownOpen = false
        this.$nextTick(() => {
          this.$store.commit('plugin/routing/setSearchResults', [])
        })
      } else {
        console.error('No street name available for selected result:', result)
      }
    },
    selectEnd(result) {
      if (result.strassenname) {
        this.endpointInput = result.displayName
        this.setEnd(result.position)
        this.setEndAddress(result.displayName)
        this.endDropdownOpen = false
        this.$nextTick(() => {
          this.$store.commit('plugin/routing/setSearchResults', [])
        })
      } else {
        console.error('No street name available for selected result:', result)
      }
    },
    translatedRouteTypeToAvoid(myKey) {
      const localKey = this.selectableRouteTypesToAvoid.find(
        (element) => element.key === myKey
      ).localKey
      return localKey
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
.align-center {
  text-align: center;
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
