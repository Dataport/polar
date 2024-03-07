<template>
  <v-card class="text-locator-search-card">
    <v-card-title class="text-locator-card-collapse">
      {{ $t('common:plugins.geometrySearch.draw.title') }}
    </v-card-title>
    <v-card-text class="text-locator-card-collapse">
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
    <v-card-text
      v-if="tipVisibility[_drawMode]"
      class="text-locator-card-collapse"
    >
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
        color="info"
        :items="treeViewItems"
      >
        <template #label="{ item }">
          <v-badge
            color="info"
            inline
            left
            :content="item.count"
            class="text-locator-result-badge"
          >
            {{ item.name }}
          </v-badge>
        </template>
        <template #append="{ item }">
          <v-tooltip v-if="item.type === 'toponym' || item.children" left>
            <template #activator="{ on, attrs }">
              <v-btn
                :aria-label="
                  $t(
                    `plugins.geometrySearch.tooltip.highlight.${
                      item?.children?.length && item.type !== 'toponym'
                        ? 'heat'
                        : 'cold'
                    }`
                  )
                "
                color="secondary"
                icon
                fab
                x-small
                dark
                v-bind="attrs"
                v-on="on"
                @click="changeActiveData(item)"
                @keypress="changeActiveData(item)"
              >
                <v-icon>fa-map-location-dot</v-icon>
              </v-btn>
            </template>
            <!-- TODO fix font -->
            <span>{{
              $t(
                `plugins.geometrySearch.tooltip.highlight.${
                  item?.children?.length && item.type !== 'toponym'
                    ? 'heat'
                    : 'cold'
                }`
              )
            }}</span>
          </v-tooltip>
          <v-tooltip v-if="item.type === 'toponym'" left>
            <template #activator="{ on, attrs }">
              <v-btn
                :aria-label="$t('plugins.geometrySearch.tooltip.focusSearch')"
                color="secondary"
                icon
                fab
                x-small
                dark
                v-bind="attrs"
                v-on="on"
                @click="fullSearchOnToponym(item)"
                @keypress="fullSearchOnToponym(item)"
              >
                <v-icon>fa-magnifying-glass-arrow-right</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('plugins.geometrySearch.tooltip.focusSearch') }}</span>
          </v-tooltip>
        </template>
      </v-treeview>
      <v-card-text v-else>
        {{ $t('common:plugins.geometrySearch.results.none') }}
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { DrawMode } from '@polar/lib-custom-types'
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { TextLocatorCategories } from '../types'

export default Vue.extend({
  name: 'GeometrySearchPlugin',
  data: () => ({
    tipVisibility: {
      Point: true,
      Polygon: true,
    },
  }),
  computed: {
    ...mapGetters('plugin/geometrySearch', ['byCategory', 'treeViewItems']),
    ...mapGetters('plugin/draw', ['drawMode']),
    _byCategory: {
      get() {
        return this.byCategory
      },
      set(byCategory: TextLocatorCategories) {
        this.setByCategory(byCategory)
      },
    },
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
    ...mapActions('plugin/geometrySearch', [
      'changeActiveData',
      'fullSearchOnToponym',
    ]),
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

    // determined by trial & error ¯\ツ/¯
    &:hover:not(:last-child),
    &:focus:not(:last-child) {
      z-index: 1;
      margin-left: -2px;
      margin-right: -2px;
    }

    &:hover:last-child,
    &:focus:last-child {
      margin-left: -3px;
    }
  }

  .text-locator-result-badge {
    cursor: pointer;
    max-width: 500px;
    width: 500px;
    white-space: normal;
    justify-content: left;
    margin: 0.5em 0;
  }
}
</style>
