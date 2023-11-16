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
      class="polar-plugin-address-search-results-list"
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
      <template v-for="(feature, innerDex) in features">
        <v-list-item
          v-if="innerDex < limitResults || areResultsExpanded(category)"
          :id="
            [
              'polar-plugin-address-search-results-feature',
              index,
              innerDex,
            ].join('-')
          "
          :key="['results-feature', index, innerDex].join('-')"
          tag="li"
          tabindex="-1"
          :class="{
            'polar-plugin-address-search-hidden-result':
              innerDex >=
              (areResultsExpanded(category)
                ? Number.MAX_SAFE_INTEGER
                : limitResults),
          }"
          @keydown.down.prevent.stop="
            focusNextElement(
              true,
              Number(index),
              features.length,
              category,
              Number(innerDex)
            )
          "
          @keydown.up.prevent.stop="
            focusNextElement(
              false,
              Number(index),
              features.length,
              category,
              Number(innerDex)
            )
          "
          @click="selectResult({ feature, categoryId })"
        >
          <v-list-item-title>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="emTitleByInput(feature.title, inputValue)"></span>
          </v-list-item-title>
        </v-list-item>
      </template>
      <v-btn
        v-if="features.length > limitResults"
        :id="`polar-plugin-address-search-results-feature-expand-button-${index}`"
        text
        tile
        block
        class="text-none"
        @keydown.down.prevent.stop="
          focusNextElement(true, Number(index), features.length, category)
        "
        @keydown.up.prevent.stop="
          focusNextElement(false, Number(index), features.length, category)
        "
        @click="toggle(category)"
      >
        <v-icon x-small class="mr-1">
          {{
            areResultsExpanded(category) ? 'fa-chevron-up' : 'fa-chevron-down'
          }}
        </v-icon>
        {{
          $t(
            `common:plugins.addressSearch.resultList.${
              areResultsExpanded(category)
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
import { focusFirstResult } from '../utils/focusFirstResult'
import { emTitleByInput } from '../utils/emTitleByInput'

export default Vue.extend({
  name: 'AddressSearchResults',
  data: () => ({
    openCategories: [] as string[],
  }),
  computed: {
    ...mapGetters(['clientHeight', 'hasWindowSize']),
    ...mapGetters('plugin/addressSearch', [
      'featuresAvailable',
      'featureListsWithCategory',
      'focusAfterSearch',
      'inputValue',
      'limitResults',
      'selectedGroupId',
      'selectedGroup',
    ]),
    maxHeight(): number {
      return this.hasWindowSize ? this.clientHeight * 0.6 : 400
    },
  },
  watch: {
    featuresAvailable(): void {
      if (this.focusAfterSearch) {
        this.$nextTick(focusFirstResult)
      }
    },
    /* reset opened categories on group change */
    selectedGroupId(): void {
      this.openCategories = []
    },
  },
  methods: {
    ...mapActions('plugin/addressSearch', ['selectResult']),
    focusFirstResult,
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
    isExpandButtonVisible(featureListLength: number): boolean {
      return featureListLength > this.limitResults
    },
    areResultsExpanded(category: string): boolean {
      return this.openCategories.includes(category)
    },
    getNextElementId(
      down: boolean,
      index: number,
      featureListLength: number,
      category: string,
      innerDex: number | undefined
    ): string {
      if (typeof innerDex === 'number') {
        return this.getNextListElementId(
          down,
          index,
          innerDex,
          featureListLength,
          category
        )
      }
      if (this.isExpandButtonVisible(featureListLength)) {
        return this.getExpandButtonId(down, index, featureListLength, category)
      }
      // This is just here as a fallback
      console.error(
        'AddressSearch: Trying to focus on an expand button not possible as it is not rendered. Focus remains on the current element.'
      )
      return ''
    },
    getNextListElementId(
      down: boolean,
      index: number,
      innerDex: number,
      featureListLength: number,
      category: string
    ): string {
      const nextInnerDex = down ? innerDex + 1 : innerDex - 1

      if (nextInnerDex === -1 && index === 0) {
        return 'polar-plugin-address-search-input'
      }
      if (this.isExpandButtonVisible(featureListLength)) {
        if (nextInnerDex === -1) {
          return `polar-plugin-address-search-results-feature-expand-button-${
            index - 1
          }`
        }
        const resultsExpanded = this.areResultsExpanded(category)
        if (
          (!resultsExpanded && nextInnerDex === this.limitResults) ||
          (resultsExpanded && nextInnerDex === featureListLength)
        ) {
          return `polar-plugin-address-search-results-feature-expand-button-${index}`
        }
      }

      const nextIndex =
        nextInnerDex === featureListLength
          ? index + 1 === this.featureListsWithCategory.length
            ? 0
            : index + 1
          : index
      const usedInnerDex = nextInnerDex === featureListLength ? 0 : nextInnerDex

      return [
        'polar-plugin-address-search-results-feature',
        nextIndex,
        usedInnerDex,
      ].join('-')
    },
    getExpandButtonId(
      down: boolean,
      index: number,
      featureListLength: number,
      category: string
    ): string {
      let nextIndex: number
      let nextInnerDex: number
      if (down) {
        nextIndex =
          index + 1 === this.featureListsWithCategory.length ? 0 : index + 1
        nextInnerDex = 0
      } else {
        nextIndex = index
        nextInnerDex = this.areResultsExpanded(category)
          ? featureListLength - 1
          : this.limitResults - 1
      }
      return `polar-plugin-address-search-results-feature-${nextIndex}-${nextInnerDex}`
    },
    focusNextElement(
      down: boolean,
      index: number,
      featureListLength: number,
      category: string,
      innerDex?: number
    ): void {
      const nextElement =
        // @ts-expect-error | Type conversion is fine here as the querySelector method is monkeyPatched in core/createMap
        (document.querySelector('[data-app]') as ShadowRoot).getElementById(
          this.getNextElementId(
            down,
            index,
            featureListLength,
            category,
            innerDex
          )
        )
      if (nextElement) {
        nextElement.focus()
      }
    },
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

<style lang="scss" scoped>
.polar-plugin-address-search-results-list {
  padding-left: 0;
}
</style>
