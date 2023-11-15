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
        :id="
          ['polar-plugin-address-search-results-feature', index, innerDex].join(
            '-'
          )
        "
        :key="['results-feature', index, innerDex].join('-')"
        tag="li"
        :class="{
          'polar-plugin-address-search-hidden-result':
            innerDex >=
            (openCategories.includes(category)
              ? Number.MAX_SAFE_INTEGER
              : limitResults),
        }"
        @keydown.down.prevent.stop="
          focusNextElement(
            true,
            Number(index),
            Number(innerDex),
            features.length
          )
        "
        @keydown.up.prevent.stop="
          focusNextElement(
            false,
            Number(index),
            Number(innerDex),
            features.length
          )
        "
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
    featuresAvailable(): void {
      this.$nextTick(() => {
        const firstElement =
          // @ts-expect-error | Type conversion is fine here as the querySelector method is monkeyPatched in core/createMap
          (document.querySelector('[data-app]') as ShadowRoot).getElementById(
            'polar-plugin-address-search-results-feature-0-0'
          )
        if (firstElement) {
          firstElement.focus()
        }
      })
    },
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
    getNextElementId(
      index: number,
      nextInnerDex: number,
      featureListLength: number
    ): string {
      if (nextInnerDex === -1 && index === 0) {
        return 'polar-plugin-address-search-input'
      }

      let nextIndex: number
      let usedInnerDex: number
      if (nextInnerDex === -1) {
        nextIndex = index - 1
        usedInnerDex = this.featureListsWithCategory[nextIndex].length - 1
      } else if (nextInnerDex === featureListLength) {
        nextIndex =
          index + 1 === this.featureListsWithCategory.length ? 0 : index + 1
        usedInnerDex = 0
      } else {
        nextIndex = index
        usedInnerDex = nextInnerDex
      }
      return [
        'polar-plugin-address-search-results-feature',
        nextIndex,
        usedInnerDex,
      ].join('-')
    },
    focusNextElement(
      down: boolean,
      index: number,
      innerDex: number,
      featureListLength: number
    ): void {
      const nextElement =
        // @ts-expect-error | Type conversion is fine here as the querySelector method is monkeyPatched in core/createMap
        (document.querySelector('[data-app]') as ShadowRoot).getElementById(
          this.getNextElementId(
            index,
            down ? innerDex + 1 : innerDex - 1,
            featureListLength
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
