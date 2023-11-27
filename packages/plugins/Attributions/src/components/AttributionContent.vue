<!-- eslint-disable vue/no-v-html -->
<template>
  <v-scroll-x-reverse-transition>
    <v-card
      dir="ltr"
      dense
      filled
      :width="renderType === 'independent' ? windowWidth : 'inherit'"
      color="#ffffffdd"
      :max-width="maxWidth"
    >
      <!-- TODO: Add solution to be able to also translate attribution when it becomes necessary -->
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

export default Vue.extend({
  name: 'AttributionContent',
  computed: {
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/attributions', [
      'mapInfo',
      'windowWidth',
      'renderType',
    ]),
    maxWidth(): number {
      return this.hasWindowSize && this.hasSmallWidth
        ? this.clientWidth * 0.85
        : 1080
    },
    cardText(): string {
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
