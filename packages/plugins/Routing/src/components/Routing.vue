<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-routing-menu">
      <v-card-title>{{ $t('common:plugins.routing.title') }} </v-card-title>
      <v-text-field :label="$t('common:plugins.routing.startLabel')">
      </v-text-field>
      <v-text-field :label="$t('common:plugins.routing.endLabel')">
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
              v-for="routeType in selectableRouteTypesToAvoid"
              :key="routeType.key"
              v-model="selectedRouteTypesToAvoidItems"
              :label="$t(translatedRouteTypeToAvoid(routeType.key))"
              :value="routeType.key"
            ></v-checkbox>
          </v-flex>
        </v-layout>
      </div>
      <v-btn @click="sendRequest">Send Request</v-btn>
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
    ]),
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
    selectedRouteTypesToAvoidItems: {
      get(): string {
        return this.selectedRouteTypesToAvoid
      },
      set(value: string): void {
        this.setSelectedRouteTypesToAvoid(value)
      },
    },
  },
  mounted() {
    this.setupModule()
  },
  methods: {
    ...mapActions('plugin/routing', [
      'setupModule',
      'resetCoordinates',
      'sendRequest',
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
      console.error(localKey)
      return localKey
    },
  },
})
</script>

<style>
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
