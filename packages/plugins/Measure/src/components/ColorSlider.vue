<template>
  <div class="mb-1">
    <span class="text--secondary">{{ $t(title) }}</span>
    <div class="d-flex align-center">
      <v-sheet
        class="mr-1"
        :color="'rgb(' + rgbValue + ')'"
        elevation="2"
        height="5em"
        width="0.3em"
        rounded
      ></v-sheet>
      <div class="flex-grow-1">
        <v-slider
          v-model="r"
          color="red"
          track-color="red"
          :max="255"
          :min="0"
          thumb-label
          hide-details
        ></v-slider>
        <v-slider
          v-model="g"
          color="green"
          track-color="green"
          :max="255"
          :min="0"
          thumb-label
          hide-details
        ></v-slider>
        <v-slider
          v-model="b"
          color="blue"
          track-color="blue"
          :max="255"
          :min="0"
          thumb-label
          hide-details
        ></v-slider>
      </div>
    </div>
    <v-btn
      class="text-none"
      block
      color="primary"
      rounded
      small
      @click="changeCallback({ r, g, b })"
    >
      {{
        $t('common:plugins.measure.label.buttons.setColor', {
          title: $t(title),
        })
      }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ColorSlider',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    initialR: {
      type: Number,
      min: 0,
      max: 255,
      required: true,
    },
    initialG: {
      type: Number,
      min: 0,
      max: 255,
      required: true,
    },
    initialB: {
      type: Number,
      min: 0,
      max: 255,
      required: true,
    },
    changeCallback: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      r: this.initialR,
      g: this.initialG,
      b: this.initialB,
    }
  },
  computed: {
    rgbValue() {
      return this.r + ',' + this.g + ',' + this.b
    },
  },
})
</script>
