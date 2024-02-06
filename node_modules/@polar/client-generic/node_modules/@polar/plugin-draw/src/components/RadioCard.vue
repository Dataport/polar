<template>
  <div>
    <v-card-title :id="`polar-draw-${id}`">{{ $t(title) }}</v-card-title>
    <v-card-text>
      <v-radio-group
        :aria-labelledby="`polar-draw-${id}`"
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
      </v-radio-group>
    </v-card-text>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'RadioCard',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    values: {
      type: Object,
      required: true,
    },
    initialValue: {
      type: String,
      required: true,
    },
    changeCallback: {
      type: Function,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.v-card__title {
  padding-top: 0;
  padding-bottom: 0;
  font-size: 100%;
}

.v-input--radio-group {
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0.5em;
}

.v-card__text {
  padding-bottom: 0;
}
</style>
