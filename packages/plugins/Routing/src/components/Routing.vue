<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-routing-menu">
      <v-card-title>{{ $t('common:plugins.routing.title') }} </v-card-title>
      <v-text-field
        v-model="startpointInput"
        :label="$t('common:plugins.routing.startLabel')"
        :hint="$t('common:plugins.routing.inputHint')"
        persistent-hint
        @input="sendSearchRequest"
      >
      </v-text-field>
      <v-text-field
        v-model="endpointInput"
        :label="$t('common:plugins.routing.endLabel')"
      >
      </v-text-field>
      <v-btn @click="resetCoordinates"
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
      <v-btn @click="sendRequest">Send Request</v-btn>
      <v-btn @click="showSteps = !showSteps">
        {{ $t('common:plugins.routing.routeDetails') }}
      </v-btn>
      <div v-if="showSteps">
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

export default Vue.extend({
  name: 'RoutingPlugin',
  data: () => ({
    isOpen: false,
    // TODO: wieder rausnhemen, wenn es nicht funktioniert
    inline: null,
    showSteps: false,
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
      'selectedRouteTypesToAvoid',
      'searchResponseData',
      'start',
      'end',
    ]),
    startpointInput: {
      get(): Coordinate {
        return this.start
      },
      set(value: Coordinate): void {
        this.start(value)
      },
    },
    endpointInput: {
      get(): Coordinate {
        return this.end
      },
      set(value: Coordinate): void {
        this.end(value)
      },
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
        return this.searchResponseData?.features[0].properties.segments[0].steps
      },
    },
  },
  watch: {
    search: function () {
      // TODO: prüfen, ob die Koordinaten im richtigen Format sind
      // TODO: Koordinaten an den Routingdienst übermitteln mit sendRequest() - zu vermeidende Routentypen mitsenden
      this.sendRequest()
    },
  },
  mounted() {
    this.initializeTool()
  },
  methods: {
    ...mapActions('plugin/routing', [
      'initializeTool',
      'resetCoordinates',
      'sendRequest',
      'sendSearchRequest',
    ]),
    ...mapMutations('plugin/routing', [
      'setSelectedTravelMode',
      'setSelectedPreference',
      'setSelectedRouteTypesToAvoid',
      'setSearchResponseData',
    ]),
    translatedRouteTypeToAvoid(myKey) {
      const localKey = this.selectableRouteTypesToAvoid.find(
        (element) => element.key === myKey
      ).localKey
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
</style>
