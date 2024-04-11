<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-measure-card">
      <v-expansion-panels accordion flat tile multiple>
        <ExpansionPanel
          id="mode"
          title="common:plugins.featureDistance.title.mode"
        >
          <v-radio-group
            dense
            hide-details
            :value="mode"
            @change="setMode($event)"
          >
            <v-radio
              v-for="[key, value] in Object.entries(selectableModes)"
              :key="key"
              :label="$t(value)"
              :value="key"
            ></v-radio>
          </v-radio-group>
          <v-btn
            v-if="mode === 'delete'"
            class="text-none"
            block
            color="primary"
            rounded
            small
            @click="clearLayer"
          >
            Delete All
          </v-btn>
          <div
            v-if="mode === 'draw'"
            class="d-flex align-center justify-space-between"
          >
            <button class="text--secondary" @click="toggleMeasureMode">
              {{ $t('common:plugins.featureDistance.label.distance') }}
            </button>
            <v-switch
              class="mt-0"
              color="primary"
              :value="measureMode === 'area'"
              hide-details
              @change="setMeasureMode(measure($event))"
            ></v-switch>
            <button class="text--secondary" @click="toggleMeasureMode">
              {{ $t('common:plugins.featureDistance.label.area') }}
            </button>
          </div>
        </ExpansionPanel>
        <ExpansionPanel
          id="unit"
          title="common:plugins.featureDistance.title.unit"
        >
          <v-radio-group
            dense
            hide-details
            :value="unit"
            @change="setUnit($event)"
          >
            <v-radio
              v-for="[key, value] in Object.entries(selectableUnits)"
              :key="key"
              :label="$t(value)"
              :value="key"
            ></v-radio>
          </v-radio-group>
        </ExpansionPanel>
        <ExpansionPanel
          id="color"
          title="common:plugins.featureDistance.title.color"
        >
          <span
            class="d-block text-center"
            :style="{
              color: `rgb(${rgbTextColor})`,
              'font-size': `15px`,
              'text-shadow': `rgb(${rgbColor}) 0 0 3px`,
            }"
            >{{ $t('common:plugins.featureDistance.label.text') }}</span
          >
          <div
            :style="{
              'background-color': `rgb(${rgbColor})`,
              height: `3px`,
            }"
          ></div>
          <ColorSlider
            id="lineColor"
            title="common:plugins.featureDistance.label.line"
            :initial-r="color.r"
            :initial-g="color.g"
            :initial-b="color.b"
            :change-callback="setLineColor"
          ></ColorSlider>
          <ColorSlider
            id="textColor"
            title="common:plugins.featureDistance.label.text"
            :initial-r="textColor.r"
            :initial-g="textColor.g"
            :initial-b="textColor.b"
            :change-callback="setTextColor"
          ></ColorSlider>
        </ExpansionPanel>
      </v-expansion-panels>
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ColorSlider from './ColorSlider.vue'
import ExpansionPanel from './ExpansionPanel.vue'

export default Vue.extend({
  name: 'FeatureDistance',
  components: {
    ColorSlider,
    ExpansionPanel,
  },
  computed: {
    ...mapGetters('plugin/featureDistance', [
      'mode',
      'selectableModes',
      'measureMode',
      'selectableMeasureMode',
      'unit',
      'selectableUnits',
      'color',
      'textColor',
    ]),
    rgbColor(): string {
      return this.color.r + ',' + this.color.g + ',' + this.color.b
    },
    rgbTextColor(): string {
      return this.textColor.r + ',' + this.textColor.g + ',' + this.textColor.b
    },
  },
  watch: {},
  methods: {
    ...mapActions('plugin/featureDistance', [
      'setMode',
      'setMeasureMode',
      'setUnit',
      'setLineColor',
      'setTextColor',
      'clearLayer',
    ]),
    measure(value: boolean): string {
      return value ? 'area' : 'distance'
    },
    toggleMeasureMode() {
      this.setMeasureMode(this.measureMode === 'distance' ? 'area' : 'distance')
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-measure-card {
  min-width: 12em;
}

.v-input--radio-group {
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0.5em;
}

.v-expansion-panel-content::v-deep .v-expansion-panel-content__wrap {
  padding: 0;
  padding-top: 0.5em;
}

.v-expansion-panel-header {
  font-size: 100%;
  min-height: 0;
  padding: 0;
}

.v-expansion-panel {
  padding: 0.5em;
}

.f1 {
  font-size: 1em;
}
</style>
