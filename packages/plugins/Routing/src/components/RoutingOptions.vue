<template>
  <div>
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
      <p>{{ $t('plugins.routing.avoidRoutesTitle') }}</p>
      <div class="checkbox-container">
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

    routeTypesToAvoidForSelectedProfile() {
      return this.selectedTravelMode === 'driving-car' ||
        this.selectedTravelMode === 'driving-hgv' ||
        this.selectedTravelMode === ''
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
    translatedRouteTypeToAvoid(myKey: string) {
      return this.selectableRouteTypesToAvoid.find(
        (element) => element.key === myKey
      ).locale
    },
  },
})
</script>

<style scoped lang="scss">
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

.select {
  width: 65%;
}
</style>
