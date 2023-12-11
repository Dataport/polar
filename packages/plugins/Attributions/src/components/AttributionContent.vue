<!-- eslint-disable vue/no-v-html -->
<template>
  <v-scroll-x-reverse-transition>
    <v-card
      dense
      filled
      :width="width"
      :color="renderType === 'independent' ? '#ffffffdd' : ''"
      :max-width="maxWidth"
    >
      <v-card-title>
        {{ $t('common:plugins.attributions.title') }}
      </v-card-title>
      <!-- NOTE: The usage of v-html is considered unsafe as it
        opens a window for XSS attacks. In this case, the information is retrieved
        from the mapConfiguration. This is fine by configuration. -->
      <v-card-text ref="sources" v-html="cardText" />
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import { t } from 'i18next'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import noop from '@repositoryname/noop'

export default Vue.extend({
  name: 'AttributionContent',
  props: {
    maxWidth: {
      type: [Number, String],
      default: 'inherit',
    },
    width: {
      type: [Number, String],
      default: 'inherit',
    },
  },
  computed: {
    ...mapGetters(['language']),
    ...mapGetters('plugin/attributions', ['mapInfo', 'renderType']),
    cardText(): string {
      noop(this.language)
      return this.mapInfo
        .map((x) =>
          t(x, {
            MONTH: `${new Date().getMonth() + 1}`.padStart(2, '0'),
            YEAR: new Date().getFullYear().toString(),
          })
        )
        .join('<br>')
    },
  },
  mounted() {
    // NOTE: sources will always be defined unless someone removes the ref from the v-card-text element
    if (
      (this.$refs.sources as HTMLElement).getElementsByTagName('a').length > 0
    ) {
      this.$nextTick(() =>
        (this.$refs.sources as HTMLElement)
          .getElementsByTagName('a')[0]
          .focus({ focusVisible: true })
      )
    }
  },
})
</script>

<style scoped lang="scss"></style>
