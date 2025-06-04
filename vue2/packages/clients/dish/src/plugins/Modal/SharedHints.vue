<template>
  <v-card elevation="12" class="modal-card">
    <v-btn icon class="modal-info-close-button" @click="closed = true">
      <v-icon>fa-xmark</v-icon>
    </v-btn>
    <v-card-title class="modal-title" tag="h1">
      {{ $t(mainTitle) }}
    </v-card-title>
    <v-card-title
      v-if="title"
      class="modal-title"
      style="font-size: 1.3rem"
      tag="h2"
    >
      {{ $t(title) }}
    </v-card-title>
    <v-card-title
      v-if="subTitle"
      class="modal-title"
      style="font-size: 1.1rem"
      tag="h3"
    >
      {{ $t(subTitle) }}
    </v-card-title>
    <slot></slot>
    <v-card-actions class="modal-actions">
      <v-btn
        class="text-none primaryContrast--text"
        color="primary"
        @click="closed = true"
      >
        Textfenster schließen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSetGenerator } from '@repositoryname/vuex-generators'

export default Vue.extend({
  name: 'SharedHints',
  props: {
    mainTitle: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    subTitle: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    ...getSetGenerator('plugin/modal', ['closed']),
  },
})
</script>

<style lang="scss" scoped>
.modal-info-close-button {
  position: absolute;
  top: 2em;
  right: 2em;
}
.modal-actions {
  justify-content: end !important;
  @media only screen and (max-width: 768px) {
    justify-content: center !important;
  }
}
</style>
