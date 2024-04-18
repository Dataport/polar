<template>
  <div>
    <v-card-title class="text-locator-collapse">
      {{ $t('common:plugins.geometrySearch.draw.title') }}
    </v-card-title>
    <v-card-text class="text-locator-collapse">
      <v-radio-group v-model="_drawMode" dense hide-details>
        <v-radio
          :label="$t('common:plugins.draw.drawMode.point')"
          value="Point"
        ></v-radio>
        <v-radio
          :label="$t('common:plugins.draw.drawMode.polygon')"
          value="Polygon"
        ></v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-text v-if="tipVisibility[_drawMode]" class="text-locator-collapse">
      <v-alert
        v-model="tipVisibility[_drawMode]"
        type="info"
        prominent
        dense
        colored-border
        border="left"
        :icon="_drawMode === 'Point' ? 'fa-location-dot' : 'fa-draw-polygon'"
        dismissible
        elevation="4"
        >{{
          $t(`common:plugins.geometrySearch.draw.description.${_drawMode}`)
        }}</v-alert
      >
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { DrawMode } from '@polar/lib-custom-types'
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'GeometrySearchDrawMode',
  data: () => ({
    tipVisibility: {
      Point: true,
      Polygon: true,
    },
  }),
  computed: {
    ...mapGetters('plugin/draw', ['drawMode']),
    _drawMode: {
      get() {
        return this.drawMode
      },
      set(drawMode: DrawMode) {
        this.setDrawMode(drawMode)
      },
    },
  },
  methods: {
    ...mapActions('plugin/draw', ['setDrawMode']),
  },
})
</script>
