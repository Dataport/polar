<template>
  <v-treeview dense hoverable color="info" :items="treeViewItems">
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
          item?.children?.length && item.type !== 'toponym' ? 'heat' : 'cold'
        }`"
        :action="changeActiveData"
        icon="fa-map-location-dot"
        :tooltip-key="`plugins.geometrySearch.tooltip.highlight.${
          item?.children?.length && item.type !== 'toponym' ? 'heat' : 'cold'
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
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ResultInfo from '../../../components/ResultInfo.vue'
import { TreeViewItem } from '../types'
import Action from './Action.vue'

export default Vue.extend({
  name: 'GeometrySearchPlugin',
  components: {
    Action,
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
.text-locator-result-badge {
  cursor: pointer;
  max-width: 500px;
  width: 500px;
  white-space: normal;
  justify-content: left;
  margin: 0.5em 0;
}
</style>
