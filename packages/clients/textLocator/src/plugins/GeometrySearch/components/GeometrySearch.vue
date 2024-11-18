<template>
  <v-card class="text-locator-search-card">
    <DrawMode />
    <v-card-title class="text-locator-collapse">
      {{ $t('common:plugins.geometrySearch.results.title') }}
    </v-card-title>
    <v-card-subtitle v-if="lastSearch">
      {{
        $t('common:plugins.geometrySearch.results.source', {
          searchType: $t(
            `common:plugins.geometrySearch.results.sourceOptions.${lastSearch}`
          ),
        })
      }}
    </v-card-subtitle>
    <v-card-text>
      <ViewToggle />
      <TreeView v-if="treeViewItems.length" />
      <v-card-text v-else>
        {{ $t('common:plugins.geometrySearch.results.none') }}
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import DrawMode from './DrawMode.vue'
import ViewToggle from './ViewToggle.vue'
import TreeView from './Tree.vue'

export default Vue.extend({
  name: 'GeometrySearchPlugin',
  components: {
    DrawMode,
    TreeView,
    ViewToggle,
  },
  computed: {
    ...mapGetters('plugin/geometrySearch', ['treeViewItems', 'lastSearch']),
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
}
</style>

<style>
.text-locator-search-card .text-locator-collapse {
  padding-bottom: 0;
}
</style>
