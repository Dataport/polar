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
        :items="translatedTravelModes"
        item-value="key"
        item-text="translatedKey"
      ></v-select>
      <v-select
        v-model="selectedPreferenceItem"
        clearable
        :label="$t('common:plugins.routing.preferenceLabel')"
        :items="
          // mapping in template to guarantee update on language change
          preferenceOptionsFromMapConfig.map(({ value, text }) => ({
            value,
            text: $t(text),
          }))
        "
      ></v-select>
      <!--
      //TODO: values definieren - wo?
      <v-radio-group
        inline
        title="common:plugins.routing.avoidRoutesTitle"
        :aria-labelledby="`polar-routing-${id}`"
        dense
        hide-details
        :value="initialValue"
        @change="changeCallback"
      >
        <v-radio
          v-for="[key, value] in Object.entries(values)"
          :key="key"
          :label="$t(value)"
          :value="key"
        ></v-radio>
      </v-radio-group>-->
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
  }),
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/routing', [
      'renderType',
      'travelModeOptionsFromMapConfig',
      'preferenceOptionsFromMapConfig',
      'selectableTravelModes',
      'selectablePreferences',
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
    translatedTravelModes() {
      return this.selectableTravelModes.map((item) => ({
        ...item,
        translatedText: this.$t(item.localKey),
      }))
    },
  },
  mounted() {
    this.setupModule()
  },
  methods: {
    ...mapActions('plugin/routing', ['setupModule', 'resetCoordinates']),
    ...mapMutations('plugin/routing', [
      'setSelectedTravelMode',
      'setSelectedPreference',
      'resetCoordinates',
    ]),
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
  padding-right: 5px;
}
</style>
