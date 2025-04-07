<template>
  <v-card class="polar-plugin-mouse-position">
    <v-select
      v-model="projection"
      :aria-label="$t('plugins.mousePosition.projectionSelect.ariaLabel')"
      :items="
        projections.map((projection, index) => ({
          value: index,
          text: projection,
        }))
      "
      dense
      hide-details
    />
    <v-text-field
      :label="
        $t('plugins.mousePosition.label', {
          epsg: projections[selectedProjection],
        })
      "
      :value="coordinateString"
      dense
      hide-details
      readonly
    />
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
.polar-plugin-mouse-position .v-select {
  margin-right: 4px;

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
.polar-plugin-mouse-position {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 4px;
  padding: 12px 12px 12px 0;
}
</style>
