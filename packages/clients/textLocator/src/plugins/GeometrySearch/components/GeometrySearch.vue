<template>
  <v-card class="text-locator-search-card">
    <v-card-title class="text-locator-card-collapse">
      {{ $t('common:plugins.geometrySearch.draw.title') }}
    </v-card-title>
    <v-card-text class="text-locator-card-collapse">
      <v-radio-group v-model="_draw" dense hide-details>
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
    <v-card-text v-if="tipVisibility[_draw]" class="text-locator-card-collapse">
      <v-alert
        v-model="tipVisibility[_draw]"
        type="info"
        prominent
        dense
        colored-border
        border="left"
        :icon="_draw === 'Point' ? 'fa-location-dot' : 'fa-draw-polygon'"
        dismissible
        elevation="4"
        >{{
          $t(`common:plugins.geometrySearch.draw.description.${_draw}`)
        }}</v-alert
      >
    </v-card-text>
    <v-card-title class="text-locator-card-collapse">
      {{ $t('common:plugins.geometrySearch.results.title') }}
    </v-card-title>
    <v-card-text>
      <v-btn-toggle v-model="_byCategory" dense>
        <v-btn class="text-locator-btn-group-button" value="text">
          <v-icon small>fa-book-open</v-icon>&nbsp;
          {{ $t('common:plugins.geometrySearch.results.byText') }}
        </v-btn>
        <v-btn class="text-locator-btn-group-button" value="toponym">
          <v-icon small>fa-location-pin</v-icon>&nbsp;
          {{ $t('common:plugins.geometrySearch.results.byLocation') }}
        </v-btn>
      </v-btn-toggle>
      <v-treeview
        v-if="treeViewItems.length"
        dense
        hoverable
        activatable
        :items="treeViewItems"
      >
        <template #prepend="{ item }"> {{ item.count }} </template>
      </v-treeview>
      <v-card-text v-else>
        {{ $t('common:plugins.geometrySearch.results.none') }}
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { TextLocatorCategories, TextLocatorDrawModes } from '../types'

export default Vue.extend({
  name: 'GeometrySearchPlugin',
  data: () => ({
    tipVisibility: {
      Point: true,
      Polygon: true,
    },
  }),
  computed: {
    ...mapGetters('plugin/geometrySearch', [
      'draw',
      'byCategory',
      'treeViewItems',
    ]),
    _byCategory: {
      get() {
        return this.byCategory
      },
      set(byCategory: TextLocatorCategories) {
        this.setByCategory(byCategory)
      },
    },
    _draw: {
      get() {
        return this.draw
      },
      set(drawMode: TextLocatorDrawModes) {
        this.setDrawMode(drawMode)
      },
    },
  },
  methods: {
    ...mapActions('plugin/geometrySearch', ['setDrawMode']),
    ...mapMutations('plugin/geometrySearch', ['setByCategory']),
  },
})
</script>

<style lang="scss" scoped>
.text-locator-search-card {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  pointer-events: all;
  min-width: 400px;
  white-space: normal;

  .text-locator-card-collapse {
    padding-bottom: 0;
  }

  .text-locator-btn-group-button {
    text-transform: unset;
  }
}
</style>
