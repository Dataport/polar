<template>
  <div>
    <v-btn-toggle v-model="selectedTravelModeItem" mandatory>
      <v-btn
        v-for="mode in travelModes"
        :key="mode.key"
        :value="mode.key"
        :label="mode.translatedKey"
        :aria-label="mode.translatedKey"
        style="border: solid medium transparent !important"
      >
        <v-icon>{{ mode.icon }}</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-select
      v-if="displayPreferences"
      v-model="selectedPreferenceItem"
      :label="$t('plugins.routing.label.preference')"
      :aria-label="$t('plugins.routing.label.preference')"
      :items="preferences"
      item-value="key"
      item-text="translatedKey"
      @keydown.prevent.stop="noop"
    />
    <div v-if="displayRouteTypesToAvoid">
      <p>{{ $t('plugins.routing.avoidRoutesTitle') }}</p>
      <div class="polar-routing-checkbox-container">
        <v-checkbox
          v-for="(routeType, i) in routeTypesToAvoidForSelectedProfile"
          :key="i"
          v-model="selectedRouteTypesToAvoidItem"
          :label="$t(translatedRouteTypeToAvoid(routeType['key']))"
          :aria-label="$t(translatedRouteTypeToAvoid(routeType['key']))"
          :value="routeType['key']"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import noop from '@repositoryname/noop'
import { t } from 'i18next'
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'RoutingOptions',
  computed: {
    ...mapGetters('plugin/routing', [
      'displayPreferences',
      'displayRouteTypesToAvoid',
      'selectableRouteTypesToAvoid',
      'selectedPreference',
      'selectedRouteTypesToAvoid',
      'selectedTravelMode',
    ]),
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
          icon: 'fa-car',
        },
        {
          key: 'driving-hgv',
          translatedKey: t('plugins.routing.travelMode.hgv'),
          icon: 'fa-truck',
        },
        {
          key: 'cycling-regular',
          translatedKey: t('plugins.routing.travelMode.bike'),
          icon: 'fa-person-biking',
        },
        {
          key: 'foot-walking',
          translatedKey: t('plugins.routing.travelMode.walking'),
          icon: 'fa-person-walking',
        },
        {
          key: 'wheelchair',
          translatedKey: t('plugins.routing.travelMode.wheelchair'),
          icon: 'fa-wheelchair-move',
        },
      ]
    },

    routeTypesToAvoidForSelectedProfile() {
      return this.selectedTravelMode === 'driving-car' ||
        this.selectedTravelMode === 'driving-hgv'
        ? this.selectableRouteTypesToAvoid
        : [
            {
              key: 'ferries',
              locale: 'plugins.routing.avoidRoutes.ferries',
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
  },
  watch: {
    selectedTravelMode() {
      this.selectedRouteTypesToAvoidItem = []
    },
  },
  methods: {
    ...mapMutations('plugin/routing', [
      'setSelectedTravelMode',
      'setSelectedPreference',
      'setSelectedRouteTypesToAvoid',
    ]),
    noop,
    translatedRouteTypeToAvoid(myKey: string) {
      return this.selectableRouteTypesToAvoid.find(
        (element) => element.key === myKey
      ).locale
    },
  },
})
</script>

<style scoped lang="scss">
.polar-routing-checkbox-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  justify-content: space-evenly;
}

@media (max-width: 600px) {
  .polar-routing-checkbox-container {
    flex-direction: column;
    align-items: center;
  }
}

.v-btn-toggle > .v-btn.v-btn {
  min-width: 64px;

  &:focus,
  &:hover {
    z-index: 1;
  }
}
</style>
