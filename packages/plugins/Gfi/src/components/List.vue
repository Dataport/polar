<template>
  <v-scroll-x-reverse-transition>
    <v-card class="plugin-gfi-list">
      <v-card-title>
        <v-icon>fa-list</v-icon>
        {{ $t('plugins.gfi.list.header') }}
      </v-card-title>
      <v-card-subtitle v-if="maxPage > 1">
        {{
          `${$t('plugins.gfi.list.entry')} ${page * pageLength + 1} ${$t(
            'plugins.gfi.list.to'
          )} ${Math.min((page + 1) * pageLength, listFeatures.length)} ${$t(
            'plugins.gfi.list.of'
          )} ${listFeatures.length}`
        }}
        <v-pagination
          v-model="_page"
          color="primary"
          :length="maxPage"
          :current-page-aria-label="
            $t('plugins.gfi.list.pagination.currentPage', {
              page: _page,
              maxPage,
            })
          "
          :page-aria-label="
            $t('plugins.gfi.list.pagination.page', {
              page: _page,
              maxPage,
            })
          "
          :next-aria-label="$t('plugins.gfi.list.pagination.next')"
          :previous-aria-label="$t('plugins.gfi.list.pagination.previous')"
          :wrapper-aria-label="$t('plugins.gfi.list.pagination.wrapper')"
        ></v-pagination>
      </v-card-subtitle>
      <v-list>
        <v-list-item v-if="!visibleListFeatures.length">
          {{ $t('plugins.gfi.list.emptyView') }}
        </v-list-item>
        <v-list-item
          v-for="feature of visibleListFeatures"
          :key="`gfi-feature-list-${feature.ol_uid}`"
          :two-line="listText.length === 2"
          :three-line="listText.length === 3"
          :class="{
            'gfi-feature-list-item-hovered': isFeatureHovered(feature),
          }"
          @click="
            setOlFeatureInformation({
              feature: getCluster(map, feature, '_gfiLayerId'),
              centerOnFeature: true,
            })
          "
          @keydown.space.prevent="
            setOlFeatureInformation({
              feature: getCluster(map, feature, '_gfiLayerId'),
              centerOnFeature: true,
            })
          "
          @mouseleave="unhover"
          @mouseover="hover(feature)"
          @focusout="unhover"
          @focus="hover(feature)"
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
import getCluster from '@polar/lib-get-cluster'
import { Feature } from 'ol'
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'GfiList',
  computed: {
    ...mapGetters(['map']),
    ...mapGetters('plugin/gfi', [
      'listFeatures',
      'listText',
      'page',
      'gfiConfiguration',
      'isFeatureHovered',
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
  mounted() {
    if (this._page > this.maxPage) {
      this._page = Math.max(this.maxPage, 1)
    }
  },
  methods: {
    ...mapActions('plugin/gfi', [
      'setOlFeatureInformation',
      'setPage',
      'hover',
      'unhover',
    ]),
    ...mapMutations('plugin/gfi', ['setPage']),
    getCluster,
    applyListText(feature: Feature, index: number) {
      const text: string | ((f: Feature) => string) | undefined =
        this.listText[index]
      if (text === undefined) {
        console.error(
          `@polar/plugin-gfi: Missing text entry in configuration. See documentation of gfi.featureList.text for more information. Fallback to ol_uid.`
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

<style lang="scss">
.plugin-gfi-list {
  .v-pagination__navigation,
  .v-pagination__item {
    &:focus {
      outline: thick solid #3fa535;
    }
  }
}
</style>

<style lang="scss" scoped>
.v-card {
  @media only screen and (min-width: 769px) {
    /* magic number; leaves minimal space to minimal size AddressSearch in IconMenu mode */
    max-width: 420px;
  }
}

.v-card__title {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0.5em;
  word-break: normal;
}

.v-list-item__title + .v-list-item__subtitle {
  font-style: italic;
}

.v-list-item {
  // needed for FF
  outline-offset: -2px;

  &::before {
    background: transparent;
  }

  &:hover {
    outline: dashed 2px #3fa535;
  }

  &:focus {
    outline: solid 2px #3fa535;
  }
}

.gfi-feature-list-item-hovered {
  background: #dff0dd;
}
</style>
