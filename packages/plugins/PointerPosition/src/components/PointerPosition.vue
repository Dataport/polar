<template>
  <v-card class="polar-plugin-pointer-position">
    <span class="polar-plugin-coordinate-display">
      {{ $t('plugins.pointerPosition.label', { value: coordinateString }) }}
    </span>
    <v-select
      v-if="projections.length > 1"
      v-model="projection"
      class="polar-plugin-epsg-select"
      :label="$t('plugins.pointerPosition.projectionSelect.label')"
      :items="
        projections.map((projection, index) => ({
          value: index,
          text: projection.code,
        }))
      "
      dense
      hide-details
      @keydown.up.stop
      @keydown.right.stop
      @keydown.down.stop
      @keydown.left.stop
    />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'PointerPosition',
  computed: {
    ...mapGetters(['hasSmallDisplay', 'configuration']),
    ...mapGetters('plugin/pointerPosition', [
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
    ...mapActions('plugin/pointerPosition', ['setSelectedProjection']),
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-pointer-position {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 4px;
  padding: 12px;

  .polar-plugin-epsg-select {
    max-width: 250px;
  }
}
</style>
