<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      >{{ $t(title) }}
      <template #actions>
        <v-icon class="f1"> $expand </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <slot></slot>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ExpansionPanel',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
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
