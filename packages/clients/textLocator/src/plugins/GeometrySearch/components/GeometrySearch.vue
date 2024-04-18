<template>
  <v-card class="text-locator-search-card">
    <DrawMode />
    <v-card-title class="text-locator-collapse">
      {{ $t('common:plugins.geometrySearch.results.title') }}
    </v-card-title>
    <v-card-text>
      <ViewToggle />
      <v-treeview
        v-if="treeViewItems.length"
        dense
        hoverable
        color="info"
        :items="treeViewItems"
      >
        <template #label="{ item }">
          <v-badge color="info" inline left class="text-locator-result-badge">
            <template #badge>
              <v-tooltip left>
                <template #activator="{ on }">
                  <span v-on="on">{{ item.count }}</span>
                </template>
                <span>{{ $t(tooltipKey(item)) }}</span>
              </v-tooltip>
            </template>
            {{ item.name }}
            <template v-if="item.type === 'toponym' && item.feature">
              &nbsp;
              <ResultInfo :feature="item.feature" direction="left"></ResultInfo>
            </template>
          </v-badge>
        </template>
        <template #append="{ item }">
          <Action
            v-if="item.type === 'toponym' || item.children"
            :item="item"
            :aria-label-key="`plugins.geometrySearch.tooltip.highlight.${
              item?.children?.length && item.type !== 'toponym'
                ? 'heat'
                : 'cold'
            }`"
            :action="changeActiveData"
            icon="fa-map-location-dot"
            :tooltip-key="`plugins.geometrySearch.tooltip.highlight.${
              item?.children?.length && item.type !== 'toponym'
                ? 'heat'
                : 'cold'
            }`"
          ></Action>
          <Action
            v-if="item.type === 'toponym'"
            :item="item"
            aria-label-key="plugins.geometrySearch.tooltip.focusSearch"
            :action="fullSearchOnToponym"
            icon="fa-magnifying-glass-arrow-right"
            tooltip-key="plugins.geometrySearch.tooltip.focusSearch"
          ></Action>
          <Action
            v-if="item.type === 'text'"
            :item="item"
            aria-label-key="plugins.geometrySearch.tooltip.textSearch"
            :action="fullSearchLiterature"
            icon="fa-magnifying-glass-arrow-right"
            tooltip-key="plugins.geometrySearch.tooltip.textSearch"
          ></Action>
        </template>
      </v-treeview>
      <v-card-text v-else>
        {{ $t('common:plugins.geometrySearch.results.none') }}
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ResultInfo from '../../../components/ResultInfo.vue'
import { TreeViewItem } from '../types'
import DrawMode from './DrawMode.vue'
import ViewToggle from './ViewToggle.vue'
import Action from './Action.vue'

export default Vue.extend({
  name: 'GeometrySearchPlugin',
  components: {
    DrawMode,
    Action,
    ViewToggle,
    ResultInfo,
  },
  computed: {
    ...mapGetters('plugin/geometrySearch', ['treeViewItems']),
  },
  methods: {
    ...mapActions('plugin/geometrySearch', [
      'changeActiveData',
      'fullSearchOnToponym',
      'fullSearchLiterature',
    ]),
    tooltipKey(item: TreeViewItem) {
      return `plugins.geometrySearch.tooltip.badge.${
        item.type === 'toponym' && item.children
          ? 'toponymToText'
          : item.type === 'toponym' && !item.children
          ? 'toponymInText'
          : item.children
          ? 'textToToponym'
          : 'textInToponym'
      }`
    },
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

<style>
.text-locator-search-card .text-locator-collapse {
  padding-bottom: 0;
}
</style>
