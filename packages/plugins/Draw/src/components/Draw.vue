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
      <div v-if="showDrawOptions">
        <v-card-title>{{
          $t('common:plugins.draw.title.options')
        }}</v-card-title>
        <v-card-actions>
          <v-col>
            <v-btn class="color-picker-button" @click="toggleColorPicker">
              <v-label>{{ $t('common:plugins.draw.options.stroke') }}</v-label>
              <v-icon right>
                {{
                  isColorPickerVisible
                    ? 'fa-solid fa-chevron-up'
                    : 'fa-solid fa-chevron-down'
                }}
              </v-icon>
            </v-btn>
            <v-expand-transition>
              <v-color-picker
                v-if="isColorPickerVisible"
                class="color-picker"
                :value="selectedStrokeColor"
                @input="setSelectedStrokeColor"
              ></v-color-picker>
            </v-expand-transition>
          </v-col>
        </v-card-actions>
      </div>
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
      'configuration',
      'showDrawOptions',
    ]),
    flexStyle(): string {
      return `flex-direction: ${
        this.hasWindowSize && this.hasSmallHeight ? 'row-reverse' : 'column'
      }`
    },
  },
  mounted() {
    this.initializeConfigStyle()
  },
  methods: {
    ...mapActions('plugin/draw', [
      'setMode',
      'setDrawMode',
      'setTextInput',
      'setSelectedSize',
      'setSelectedStrokeColor',
      'initializeConfigStyle',
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

.v-card__title {
  padding-top: 0;
  padding-bottom: 0;
  font-size: 100%;
}

.v-card__actions {
  padding-top: 0;
}

.color-picker {
  margin-top: 0.5em;
}

.color-picker-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: solid transparent;
  color: var(--polar-secondary);
  background-color: var(--polar-secondary-contrast);

  label {
    color: var(--polar-secondary);
  }
}

.color-picker {
  margin-top: 0.5em;
}
</style>
