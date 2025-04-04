<template>
  <div>
    <v-card class="polar-plugin-filter-wrapper">
      <template v-for="(layerId, layerIndex) of layers">
        <v-card-title :key="`plugin-filter-layer-title-${layerIndex}`">
          {{ $t(`plugins.filter.layerName.${layerId}`) }}
        </v-card-title>
        <v-divider :key="`plugin-filter-divider-${layerIndex}`"></v-divider>
        <v-expansion-panels
          :key="`plugin-filter-accordion-${layerIndex}`"
          accordion
        >
          <template v-if="getCategories(layerId)">
            <v-expansion-panel
              v-for="(
                { targetProperty, knownValues, selectAll }, categoryIndex
              ) of getCategories(layerId)"
              :key="`plugin-filter-panel-${layerIndex}-${categoryIndex}`"
            >
              <v-expansion-panel-header>
                {{
                  $t(
                    `plugins.filter.category.${layerId}.title.${targetProperty}`
                  )
                }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox
                  v-if="selectAll"
                  dense
                  hide-details
                  :label="$t('plugins.filter.category.deselectAll')"
                  :indeterminate="
                    getActiveCategoryAll({ layerId, targetProperty }) ===
                    'indeterminate'
                  "
                  :input-value="
                    getActiveCategoryAll({ layerId, targetProperty })
                  "
                  @change="toggleCategoryAll({ layerId, targetProperty })"
                ></v-checkbox>
                <v-checkbox
                  v-for="(knownValue, knownValueIndex) of knownValues"
                  :key="`plugin-filter-checkbox-${layerIndex}-${categoryIndex}-${knownValueIndex}`"
                  dense
                  hide-details
                  :label="
                    $t(
                      `plugins.filter.category.${layerId}.${targetProperty}.${knownValue}`
                    )
                  "
                  :input-value="
                    getActiveCategory({
                      layerId,
                      targetProperty,
                      knownValue,
                    })
                  "
                  @change="
                    toggleCategory({ layerId, targetProperty, knownValue })
                  "
                ></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </template>
          <v-expansion-panel v-if="getTimeConfig(layerId)">
            <v-expansion-panel-header class="polar-plugin-filter-expansion">
              {{ $t(`plugins.filter.time.header`) }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-radio-group
                :value="
                  getActiveTime({
                    layerId,
                  })
                "
                dense
                hide-details
                @change="
                  (radioId) =>
                    changeTimeRadio({
                      radioId,
                      layerId,
                    })
                "
              >
                <v-radio
                  :label="$t('plugins.filter.time.noRestriction')"
                  :value="0"
                  @keydown.up.stop
                  @keydown.right.stop
                  @keydown.down.stop
                  @keydown.left.stop
                ></v-radio>
                <template
                  v-for="(
                    { label, component, amount, now }, timeIndex
                  ) of getTimeOptions(layerId)"
                >
                  <v-radio
                    :key="`plugin-filter-checkbox-${layerIndex}-${timeIndex}`"
                    :label="$t(label, { count: amount })"
                    :value="timeIndex + 1"
                    @keydown.up.stop
                    @keydown.right.stop
                    @keydown.down.stop
                    @keydown.left.stop
                  ></v-radio>
                  <component
                    :is="component"
                    v-if="
                      component && getActiveTime({ layerId }) === timeIndex + 1
                    "
                    :key="`plugin-filter-checkbox-${layerIndex}-${timeIndex}-options`"
                    :layer-id="layerId"
                    :now="now"
                  ></component>
                </template>
              </v-radio-group>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'PolarFilter',
  computed: {
    ...mapGetters('plugin/filter', [
      'filterConfiguration',
      'getActiveCategory',
      'getActiveCategoryAll',
      'getActiveTime',
      'getCategories',
      'getTimeConfig',
      'getTimeOptions',
    ]),
    layers(): string[] {
      return Object.keys(this.filterConfiguration.layers)
    },
  },
  methods: {
    ...mapActions('plugin/filter', [
      'toggleCategory',
      'toggleCategoryAll',
      'changeTimeRadio',
    ]),
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-filter-wrapper {
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
