<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-draw-menu" :style="flexStyle">
      <RadioCard
        id="draw-mode"
        title="plugins.draw.title.mode"
        :initial-value="mode"
        :values="selectableModes"
        :change-callback="setMode"
      ></RadioCard>
      <RadioCard
        v-if="mode === 'draw'"
        id="draw-drawMode"
        title="plugins.draw.title.drawMode"
        :initial-value="drawMode"
        :values="selectableDrawModes"
        :change-callback="setDrawMode"
      ></RadioCard>
      <DrawOptions v-if="showDrawOptions" />
      <RadioCard
        v-if="showMeasureOptions"
        id="draw-measure"
        title="plugins.draw.title.measureMode"
        :initial-value="measureMode"
        :values="selectableMeasureModes"
        :change-callback="setMeasureMode"
      ></RadioCard>
      <v-subheader v-if="showSizeSlider" class="align-end">{{
        $t('plugins.draw.label.textSize')
      }}</v-subheader>
      <v-slider
        v-if="showSizeSlider"
        class="mx-4"
        :tick-labels="fontSizes"
        :max="fontSizes.length - 1"
        :value="selectedSize"
        step="1"
        ticks="always"
        tick-size="4"
        @change="setSelectedSize"
      ></v-slider>
      <v-textarea
        v-if="showTextInput"
        :value="textInput"
        class="ml-4"
        rows="1"
        background-color="grey lighten-3"
        @input="setTextInput"
      ></v-textarea>
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { RadioCard } from '@polar/core'
import DrawOptions from './DrawOptions.vue'

export default Vue.extend({
  name: 'PolarDraw',
  components: {
    RadioCard,
    DrawOptions,
  },
  data: () => ({
    isColorPickerVisible: false,
  }),
  computed: {
    ...mapGetters(['hasSmallHeight', 'hasWindowSize']),
    ...mapGetters('plugin/draw', [
      'drawMode',
      'fontSizes',
      'measureMode',
      'mode',
      'selectableDrawModes',
      'selectableMeasureModes',
      'selectableModes',
      'showDrawOptions',
      'showMeasureOptions',
      'selectedSize',
      'showSizeSlider',
      'showTextInput',
      'textInput',
    ]),
    flexStyle(): string {
      return `flex-direction: ${
        this.hasWindowSize && this.hasSmallHeight ? 'row-reverse' : 'column'
      }`
    },
  },
  methods: {
    ...mapActions('plugin/draw', [
      'setDrawMode',
      'setMeasureMode',
      'setMode',
      'setSelectedSize',
      'setTextInput',
    ]),
  },
})
</script>

<style lang="scss" scoped>
.polar-draw-menu {
  display: flex;
  flex-direction: column;
  max-width: inherit;
}

.mx-4 {
  font-size: 80%;
  height: 32px;
}

.align-end {
  height: 32px;
}
</style>
