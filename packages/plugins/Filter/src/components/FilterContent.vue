<template>
  <v-card class="polar-plugin-filter-wrapper">
    <template v-for="(layerId, layerIndex) of layers">
      <v-card-title :key="`plugin-filter-layer-title-${layerIndex}`">
        {{ $t(`common:plugins.filter.layerName.${layerId}`) }}
      </v-card-title>
      <v-divider :key="`plugin-filter-divider-${layerIndex}`"></v-divider>
      <v-expansion-panels
        :key="`plugin-filter-accordion-${layerIndex}`"
        accordion
      >
        <template v-if="getCategories(layerId)">
          <v-expansion-panel
            v-for="(
              { targetProperty, knownCategories, selectAll }, categoryIndex
            ) of getCategories(layerId)"
            :key="`plugin-filter-panel-${layerIndex}-${categoryIndex}`"
          >
            <v-expansion-panel-header>
              {{
                $t(
                  `common:plugins.filter.category.${layerId}.title.${targetProperty}`
                )
              }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-checkbox
                v-if="selectAll"
                dense
                hide-details
                :label="$t('common:plugins.filter.category.deselectAll')"
              ></v-checkbox>
              <v-checkbox
                v-for="(knownCategory, knownCategoryIndex) of knownCategories"
                :key="`plugin-filter-checkbox-${layerIndex}-${categoryIndex}-${knownCategoryIndex}`"
                dense
                hide-details
                :label="
                  $t(
                    `common:plugins.filter.category.${layerId}.${targetProperty}.${knownCategory}`
                  )
                "
              ></v-checkbox>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>
        <v-expansion-panel v-if="getTimeConfig(layerId)">
          <v-expansion-panel-header class="polar-plugin-filter-expansion">
            {{ $t(`common:plugins.filter.time.header`) }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-radio-group dense hide-details>
              <v-radio
                :label="$t('common:plugins.filter.time.noRestriction')"
              ></v-radio>
              <template
                v-for="(
                  { label, component, amount, unit }, timeIndex
                ) of getTimeOptions(layerId)"
              >
                <v-radio
                  :key="`plugin-filter-checkbox-${layerIndex}-${timeIndex}`"
                  :label="$t(label, { count: amount })"
                ></v-radio>
                <component
                  :is="component"
                  v-if="component"
                  :key="`plugin-filter-checkbox-${layerIndex}-${timeIndex}-options`"
                ></component>
              </template>
            </v-radio-group>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-card>
</template>

<script lang="ts">
import {
  FilterConfiguration,
  FilterConfigurationTimeOption,
} from '@polar/lib-custom-types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default Vue.extend({
  name: 'PolarFilterContent',
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/filter', ['filterConfiguration']),
    layers(): string[] {
      return Object.keys(this.filterConfiguration.layers)
    },
  },
  methods: {
    getCategories(
      layerId: string
    ): FilterConfiguration['layers']['categories'] {
      return this.filterConfiguration.layers[layerId]?.categories || []
    },
    getTimeConfig(
      layerId: string
    ): FilterConfiguration['layers'][string]['time'] {
      return this.filterConfiguration.layers[layerId]?.time || null
    },
    getTimeTarget(layerId: string) {
      const { targetProperty } = this.getTimeConfig(layerId) || {}
      return targetProperty
    },
    getTimeOptions(layerId: string) {
      const timeConfig = this.getTimeConfig(layerId)
      if (!timeConfig) {
        return []
      }
      return [
        ...(timeConfig.last || []).map(this.parseOption('last')).flat(1),
        ...(timeConfig.next || []).map(this.parseOption('next')).flat(1),
        ...(timeConfig.freeSelection || []).map((entry) => ({
          label: 'common:plugins.filter.time.chooseTimeFrame',
          component: 'div',
          amount: null,
          unit: entry.unit,
        })),
      ]
    },
    parseOption(timeDirection: 'last' | 'next') {
      return (config: FilterConfigurationTimeOption) =>
        config.amounts.map((amount) => ({
          label: `common:plugins.filter.time.${timeDirection}.${config.unit}`,
          component: null,
          amount,
          unit: config.unit,
        }))
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-filter-wrapper {
  /* TODO what's the good solution here */
  min-width: 300px;

  // tone down spacing
  .v-expansion-panel-header.v-expansion-panel-header--active {
    min-height: 48px;
  }

  .v-input--radio-group {
    margin-top: 0;
  }
}
</style>
