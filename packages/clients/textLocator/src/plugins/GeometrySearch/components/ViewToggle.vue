<template>
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
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { TextLocatorCategories } from '../types'

export default Vue.extend({
  name: 'GeometrySearchViewToggle',
  computed: {
    ...mapGetters('plugin/geometrySearch', ['byCategory']),
    _byCategory: {
      get() {
        return this.byCategory
      },
      set(byCategory: TextLocatorCategories) {
        this.setByCategory(byCategory)
      },
    },
  },
  methods: {
    ...mapMutations('plugin/geometrySearch', ['setByCategory']),
  },
})
</script>

<style lang="scss" scoped>
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
</style>
