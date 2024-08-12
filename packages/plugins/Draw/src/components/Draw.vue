<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-draw-menu" :style="flexStyle">
      <RadioCard
        id="mode"
        title="common:plugins.draw.title.mode"
        :initial-value="mode"
        :values="selectableModes"
        :change-callback="setMode"
      ></RadioCard>
      <RadioCard
        v-if="mode === 'draw'"
        id="drawMode"
        title="common:plugins.draw.title.drawMode"
        :initial-value="drawMode"
        :values="selectableDrawModes"
        :change-callback="setDrawMode"
      ></RadioCard>
      <v-btn
        v-if="mode === 'draw'"
        class="mb-2"
        color="primary"
        @click="toggleColorPicker"
      >
        {{
          isColorPickerVisible
            ? $t('common:plugins.draw.label.hideColorPicker')
            : $t('common:plugins.draw.label.showColorPicker')
        }}
      </v-btn>
      <v-color-picker
        v-if="mode === 'draw' && isColorPickerVisible"
        id="color-picker"
        :value="selectedStrokeColor"
        @input="setSelectedStrokeColor"
      ></v-color-picker>
      <v-subheader v-if="showSizeSlider" class="align-end">{{
        $t('common:plugins.draw.label.textSize')
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
import RadioCard from './RadioCard.vue'

export default Vue.extend({
  name: 'PolarDraw',
  components: {
    RadioCard,
  },
  data() {
    return {
      isColorPickerVisible: false, // Neuer Zustand für die Sichtbarkeit des Color Pickers
    }
  },
  computed: {
    ...mapGetters(['hasSmallHeight', 'hasWindowSize']),
    ...mapGetters('plugin/draw', [
      'mode',
      'drawMode',
      'selectableDrawModes',
      'selectableModes',
      'textInput',
      'showTextInput',
      'selectedSize',
      'fontSizes',
      'showSizeSlider',
      'selectedStrokeColor',
    ]),
    flexStyle(): string {
      return `flex-direction: ${
        this.hasWindowSize && this.hasSmallHeight ? 'row-reverse' : 'column'
      }`
    },
  },
  methods: {
    ...mapActions('plugin/draw', [
      'setMode',
      'setDrawMode',
      'setTextInput',
      'setSelectedSize',
      'setSelectedStrokeColor',
    ]),
    toggleColorPicker() {
      this.isColorPickerVisible = !this.isColorPickerVisible // Umschalten der Sichtbarkeit des Color Pickers
    },
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
