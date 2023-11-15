<template>
  <v-tooltip content-class="polar-tooltip" top>
    <template #activator="{ on, attrs }">
      <v-btn
        class="ma-2"
        :color="color"
        :small="small"
        :fab="fab"
        :aria-label="hint ? $t(hint) : ''"
        v-bind="attrs"
        @click="click"
        v-on="on"
      >
        <v-icon :small="smallIcon" :color="`${color}Contrast`">{{
          icon
        }}</v-icon>
      </v-btn>
    </template>
    <span v-if="hint">{{ $t(hint) }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ExportButton',
  props: {
    click: {
      type: Function,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    fab: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      required: true,
    },
    lightIcon: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    smallIcon: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
