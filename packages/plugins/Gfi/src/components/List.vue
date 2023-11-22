<!-- eslint-disable vue/no-v-html -->
<template>
  <v-scroll-x-reverse-transition>
    <v-card class="plugin-gfi-list">
      <v-card-title>
        <v-icon>fa-list</v-icon>
        {{ $t('common:plugins.gfi.list.header') }}
      </v-card-title>
      <v-list nav>
        <!-- TODO parametrize -->
        <v-list-item
          v-for="feature of listFeatures"
          :key="feature.get('id')"
          three-line
          @click="itemClick(feature)"
        >
          <v-list-item-content three-line>
            <v-list-item-title>{{
              `${feature.get('str')} ${feature.get('hsnr')}`
            }}</v-list-item-title>
            <v-list-item-subtitle class="first-subtitle">
              {{ $t(`meldemichel.skat.${feature.get('skat')}`) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ feature.get('beschr') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'GfiList',
  computed: {
    ...mapGetters('plugin/gfi', ['listFeatures']),
  },
  methods: {
    ...mapActions('plugin/gfi', ['setOlFeatureInformation']),
    itemClick(feature) {
      this.setOlFeatureInformation(feature)
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

  .first-subtitle {
    font-style: italic;
  }
}
</style>
