<template>
  <v-card
    v-if="featuresAvailable"
    tile
    dense
    class="mx-auto overflow-y-auto rounded-b-xl polar-plugin-address-search-toolbar-results"
    :max-height="maxHeight"
    tabindex="-1"
  >
    <v-list
      v-for="(
        { features, category, categoryId }, index
      ) in featureListsWithCategory"
      :key="['results-list', index].join('-')"
      tag="ul"
      subheader
    >
      <v-subheader
        v-if="Boolean(category)"
        :key="['results-category', index].join('-')"
      >
        {{ $t(category) }}
        {{
          $t('common:plugins.addressSearch.resultCount', {
            count: features.length,
          })
        }}
      </v-subheader>
      <v-list-item
        v-for="(feature, innerDex) in features"
        :key="['results-feature', index, innerDex].join('-')"
        tag="li"
        :class="{
          'polar-plugin-address-search-hidden-result':
            innerDex >=
            (openCategories.includes(category)
              ? Number.MAX_SAFE_INTEGER
              : limitResults),
        }"
        @click="selectResult({ feature, categoryId })"
      >
        <v-list-item-title>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="emTitleByInput(feature.title, inputValue)"></span>
        </v-list-item-title>
      </v-list-item>
      <v-btn
        v-if="features.length > limitResults"
        text
        tile
        block
        class="text-none"
        @click="toggle(category)"
      >
        <v-icon x-small class="mr-1">
          {{
            openCategories.includes(category)
              ? 'fa-chevron-up'
              : 'fa-chevron-down'
          }}
        </v-icon>
        {{
          $t(
            `common:plugins.addressSearch.resultList.${
              openCategories.includes(category)
                ? 'reduce'
                : `extend${hasMaximum(selectedGroup[index]) ? 'Max' : ''}`
            }`,
            selectedGroup[index]
          )
        }}
      </v-btn>
      <v-divider
        v-if="Boolean(category)"
        :key="['results-divider', index].join('-')"
      ></v-divider>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { emTitleByInput } from '../utils/emTitleByInput'

export default Vue.extend({
  name: 'AddressSearchResults',
  data: () => ({
    openCategories: [],
  }),
  computed: {
    ...mapGetters(['clientHeight', 'hasWindowSize']),
    ...mapGetters('plugin/addressSearch', [
      'featuresAvailable',
      'inputValue',
      'featureListsWithCategory',
      'limitResults',
      'selectedGroupId',
      'selectedGroup',
    ]),
    maxHeight(): number {
      return this.hasWindowSize ? this.clientHeight * 0.6 : 400
    },
  },
  watch: {
    /* reset opened categories on group change */
    selectedGroupId(): void {
      this.openCategories = []
    },
  },
  methods: {
    ...mapActions('plugin/addressSearch', ['selectResult']),
    toggle(category: string): void {
      this.openCategories =
        this.openCategories.indexOf(category) === -1
          ? [...this.openCategories, category]
          : this.openCategories.filter((s) => s !== category)
    },
    hasMaximum(searchService) {
      return Boolean(searchService?.queryParameters?.maxFeatures)
    },
    emTitleByInput,
  },
})
</script>

<style lang="scss">
.polar-plugin-address-search-toolbar-results {
  em {
    font-style: unset;
    font-weight: bold;
  }

  .v-list {
    padding-bottom: 0;
  }
}

/* hidden results are still 'rendered' to take horizontal space:
 * that prevents width hopping on result expansion */
.polar-plugin-address-search-hidden-result {
  visibility: hidden;
  overflow: hidden;
  max-height: 0;
  height: 0;
  min-height: 0;
}
</style>
