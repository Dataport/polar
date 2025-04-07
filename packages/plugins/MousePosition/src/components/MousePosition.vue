<template>
  <v-card class="mouse-position">
    <!-- TODO: tooltip is obstructive regarding v-select -->
    <v-tooltip v-if="showSelectionChooser" top>
      <template #activator="{ on, attrs }">
        <v-select
          v-model="projection"
          v-bind="attrs"
          :items="
            projections.map((projection, index) => ({
              value: index,
              text: projection,
            }))
          "
          dense
          hide-details
          v-on="on"
        />
      </template>
      <span>{{ $t('plugins.mousePosition.selectCrsTooltip') }}</span>
    </v-tooltip>
    <span class="mouse-position-coordinates">
      {{ coordinateString }}
    </span>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'MousePosition',
  computed: {
    ...mapGetters(['hasSmallDisplay', 'configuration']),
    ...mapGetters('plugin/mousePosition', [
      'projections',
      'coordinateString',
      'selectedProjection',
    ]),
    projection: {
      get() {
        return this.selectedProjection
      },
      set(value) {
        this.setSelectedProjection(value)
      },
    },
    showSelectionChooser() {
      return this.projections.length > 1
    },
  },
  methods: {
    ...mapActions('plugin/mousePosition', ['setSelectedProjection']),
  },
})
</script>

<style lang="scss">
.mouse-position .v-select {
  margin: 0;

  .v-select__selections {
    height: 0;
    width: 0;
  }

  .v-input__slot::before,
  .v-input__slot::after {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.mouse-position {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 4px;

  .mouse-position-coordinates {
    margin: 4px;
  }
}
</style>
