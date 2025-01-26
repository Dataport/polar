<!-- eslint-disable max-lines -->
<!-- eslint-disable max-lines -->
<!-- eslint-disable max-lines -->
<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-routing-menu">
      <v-card-title>{{ $t('common:plugins.routing.title') }} </v-card-title>

      <!-- Start Point with Dropdown -->
      <div style="position: relative">
        <v-text-field
          v-model="startpointInput"
          :label="$t('common:plugins.routing.startLabel')"
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

      <div style="position: relative">
        <v-text-field
          v-model="endpointInput"
          :label="$t('common:plugins.routing.endLabel')"
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

      <v-btn @click="reset"
        >{{ $t('common:plugins.routing.resetButton') }}
      </v-btn>

      <v-select
        v-model="selectedTravelModeItem"
        clearable
        :label="$t('common:plugins.routing.modeLabel')"
        :items="translatedTravelModeOptions"
        item-value="key"
        item-text="translatedKey"
      ></v-select>
      <v-select
        v-model="selectedPreferenceItem"
        clearable
        :label="$t('common:plugins.routing.preferenceLabel')"
        :items="translatedPreferenceOptions"
        item-value="key"
        item-text="translatedKey"
      ></v-select>

      <div>
        {{ $t('common:plugins.routing.avoidRoutesTitle') }}
        <v-layout row wrap>
          <v-flex>
            <v-checkbox
              v-for="(routeType, i) in selectableRouteTypesToAvoid"
              :key="i"
              v-model="selectedRouteTypesToAvoidItem"
              :label="$t(translatedRouteTypeToAvoid(routeType.key))"
              :value="routeType.key"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </div>

      <v-btn :disabled="disableSendButton" @click="sendRequest">{{
        $t('common:plugins.routing.sendRequestButton')
      }}</v-btn>

      <v-btn @click="showSteps = !showSteps">
        {{ $t('common:plugins.routing.routeDetails') }}
      </v-btn>
      <div v-if="showSteps && Object.keys(searchResponseData).length !== 0">
        <v-list v-for="(step, i) in searchResponseSegments" :key="i">
          {{ step }}
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
  name: 'RoutingPlugin',
  data: () => ({
    isOpen: false,
    showSteps: false,
    startDropdownOpen: false,
    endDropdownOpen: false,
    disableSendButton: false,
  }),
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/routing', [
      'renderType',
      'travelModeOptionsFromMapConfig',
      'preferenceOptionsFromMapConfig',
      'selectableTravelModes',
      'selectablePreferences',
      'selectableRouteTypesToAvoid',
      // TODO: warum ist selectedRTTA aufgezählt, aber selectedPreferences nicht? Kann beides raus?
      'selectedRouteTypesToAvoid',
      'searchResults',
      'searchResponseData',
      'start',
      'end',
      'startAddress',
      'endAddress',
      // TODO: löschen, falls es sich in debouncedSendSearchRequest nicht einfügen lässt
      'waitMs',
    ]),
    startpointInput: {
      get() {
        return this.startAddress? this.startAddress : this.start
      },
      set(value) {
        this.setStart(value)
      },
    },
    endpointInput: {
      get() {
        return this.endAddress? this.endAddress : this.end
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
        console.error(this.selectedRouteTypesToAvoid)
        this.setSelectedRouteTypesToAvoid(value)
      },
    },
    searchResponseSegments: {
      get(): object {
        console.error(
          'Search Response Segments or Steps: ',
          this.searchResponseData.features[0].properties.segments[0].steps
        )
        return this.searchResponseData.features[0].properties.segments[0].steps
      },
    },
  },
  mounted() {
    this.initializeTool()
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
    debouncedSendSearchRequest: debounce(function (payload) {
      this.sendSearchRequest(payload)
    }, 300),
    handleAddressSearch(inputType) {
      console.error(inputType)
      const input =
        inputType === 'start' ? this.startpointInput : this.endpointInput

      if (inputType === 'start') {
        this.startDropdownOpen = true
        this.endDropdownOpen = false
      } else if (inputType === 'end') {
        this.startDropdownOpen = false
        this.endDropdownOpen = true
      }
      this.debouncedSendSearchRequest({ input, inputType })
    },
    disableSendRequest() {
      console.error('Ist der Send-Button disabled?', this.disableSendButton)
      (this.selectedTravelMode &&
          this.selectedPreference &&
          this.selectedRouteTypesToAvoid
      )
        ? this.disableSendButton = true
        : this.disableSendButton = false
      console.error('Ist der Send-Button disabled?', this.disableSendButton)
    },
    reset() {
      this.showSteps = false
      this.resetCoordinates()
    },
    selectStart(result) {
      if (result.strassenname) {
        this.startpointInput = result.displayName
        this.setStart(result.position)
        console.error('Result Position:', result.position)
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
      console.error(localKey)
      return localKey
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
}

.dropdown {
  max-height: 300px; /* adjusts the hight */
  overflow-y: auto; /* enables scrolling */
  border: 1px solid #ccc;
  background-color: #fff;
}
</style>
