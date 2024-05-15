<template>
  <v-tooltip left>
    <template #activator="{ on, attrs }">
      <v-btn
        :aria-label="$t(ariaLabelKey)"
        color="secondary"
        icon
        fab
        x-small
        dark
        v-bind="attrs"
        v-on="on"
        @click="action(item)"
        @keydown="action(item)"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ $t(tooltipKey) }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TreeViewItem } from '../types'

export default Vue.extend({
  name: 'GeometrySearchAction',
  props: {
    action: {
      type: Function,
      required: true,
    },
    ariaLabelKey: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    item: {
      type: Object as PropType<TreeViewItem>,
      required: true,
    },
    tooltipKey: {
      type: String,
      required: true,
    },
  },
})
</script>
