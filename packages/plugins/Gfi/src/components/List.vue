<!-- eslint-disable vue/no-v-html -->
<template>
  <v-scroll-x-reverse-transition>
    <v-card class="plugin-gfi-list">
      <v-card-title>
        <v-icon>fa-list</v-icon>
        {{ $t('common:plugins.gfi.list.header') }}
      </v-card-title>
      <v-card-subtitle v-if="maxPage > 1">
        {{
          `${$t('common:plugins.gfi.list.entry')} ${page * pageLength + 1} ${$t(
            'common:plugins.gfi.list.to'
          )} ${Math.min((page + 1) * pageLength, listFeatures.length)} ${$t(
            'common:plugins.gfi.list.of'
          )} ${listFeatures.length}`
        }}
        <v-pagination
          v-model="_page"
          color="primary"
          :length="maxPage"
          :current-page-aria-label="
            $t('common:plugins.gfi.list.pagination.currentPage', {
              page: _page,
              maxPage,
            })
          "
          :page-aria-label="
            $t('common:plugins.gfi.list.pagination.page', {
              page: _page,
              maxPage,
            })
          "
          :next-aria-label="$t('common:plugins.gfi.list.pagination.next')"
          :previous-aria-label="
            $t('common:plugins.gfi.list.pagination.previous')
          "
          :wrapper-aria-label="$t('common:plugins.gfi.list.pagination.wrapper')"
        ></v-pagination>
      </v-card-subtitle>
      <v-list>
        <v-list-item v-if="!visibleListFeatures.length">
          {{ $t('common:plugins.gfi.list.emptyView') }}
        </v-list-item>
        <v-list-item
          v-for="feature of visibleListFeatures"
          :key="`gfi-feature-list-${feature.ol_uid}`"
          :two-line="listText.length === 2"
          :three-line="listText.length === 3"
          @click="itemClick(feature)"
        >
          <v-list-item-content>
            <component
              :is="index === 0 ? 'v-list-item-title' : 'v-list-item-subtitle'"
              v-for="(_, index) of listText"
              :key="`gfi-feature-list-${feature.ol_uid}-${index}`"
            >
              {{ $t(applyListText(feature, index)) }}
            </component>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import { Feature } from 'ol'
import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  name: 'GfiList',
  computed: {
    ...mapGetters('plugin/gfi', [
      'listFeatures',
      'listText',
      'page',
      'gfiConfiguration',
    ]),
    _page: {
      get() {
        return this.page + 1
      },
      set(value) {
        this.setPage(value - 1)
      },
    },
    pageLength() {
      return (
        this.gfiConfiguration.featureList.pageLength || Number.MAX_SAFE_INTEGER
      )
    },
    maxPage() {
      return Math.ceil(this.listFeatures.length / this.pageLength)
    },
    showPagination() {
      return Boolean(this.gfiConfiguration.featureList.pageLength)
    },
    visibleListFeatures() {
      return this.listFeatures.slice(
        (this._page - 1) * this.pageLength,
        this._page * this.pageLength
      )
    },
  },
  watch: {
    maxPage: function (nextMaxPage) {
      if (this._page > nextMaxPage) {
        this._page = Math.max(nextMaxPage, 1)
      }
    },
  },
  methods: {
    ...mapActions('plugin/gfi', ['setOlFeatureInformation', 'setPage']),
    ...mapMutations('plugin/gfi', ['setPage']),
    itemClick(feature) {
      this.setOlFeatureInformation(feature)
    },
    applyListText(feature: Feature, index: number) {
      const text: string | ((f: Feature) => string) | undefined =
        this.listText[index]
      if (typeof text === 'undefined') {
        console.error(
          `Missing text entry in GFI configuration. See documentation of gfi.featureList.text for more information. Fallback to ol_uid.`
        )
        // @ts-expect-error | It does exist.
        return feature.ol_uid
      }
      if (typeof text === 'string') {
        return feature.get(text)
      }
      return text(feature)
    },
  },
})
</script>

<style scoped lang="scss">
.v-card {
  @media only screen and (min-width: 769px) {
    /* magic number; leaves minimal space to minimal size AddressSearch in IconMenu mode */
    max-width: 420px;
  }
}

.plugin-gfi-list {
  .v-card__title {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.5em;
    word-break: normal;
  }
}
</style>

<style>
.plugin-gfi-list .v-list-item__title + .v-list-item__subtitle {
  font-style: italic;
}
</style>
