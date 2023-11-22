<!-- eslint-disable vue/no-v-html -->
<template>
  <v-scroll-x-reverse-transition>
    <v-card class="plugin-gfi-list">
      <v-card-title>
        <v-icon>fa-list</v-icon>
        {{ $t('common:plugins.gfi.list.header') }}
      </v-card-title>
      <v-list nav>
        <v-list-item
          v-for="feature of listFeatures"
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
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'GfiList',
  computed: {
    ...mapGetters('plugin/gfi', ['listFeatures', 'listText']),
  },
  methods: {
    ...mapActions('plugin/gfi', ['setOlFeatureInformation']),
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
#polar-plugin-gfi:not(.polar-plugin-gfi-move-handle) .plugin-gfi-list {
  /* magic number; leaves minimal space to minimal size AddressSearch in IconMenu mode */
  max-width: 420px;
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
