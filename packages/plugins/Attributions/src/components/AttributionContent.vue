<template>
  <v-scroll-x-reverse-transition>
    <v-card
      :class="renderType === 'footer' ? 'polar-plugin-attributions-footer' : ''"
      dense
      filled
      :width="width"
      :color="color"
      :max-width="maxWidth"
    >
      <v-card-title v-if="renderType !== 'footer'">
        {{ $t('common:plugins.attributions.title') }}
      </v-card-title>
      <!-- NOTE: The usage of v-html is considered unsafe as it
        opens a window for XSS attacks. In this case, the information is retrieved
        from the mapConfiguration. This is fine by configuration. -->
      <!-- eslint-disable-next-line vue/no-v-html vue/no-v-text-v-html-on-component -->
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
  computed: {
    ...mapGetters([
      'clientWidth',
      'hasSmallWidth',
      'hasWindowSize',
      'language',
    ]),
    ...mapGetters('plugin/attributions', [
      'mapInfo',
      'renderType',
      'windowWidth',
    ]),
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
    renderIndependently() {
      return this.renderType === 'independent'
    },
    color() {
      return this.renderType === 'independent' || this.renderType === 'footer'
        ? '#ffffffdd'
        : ''
    },
    maxWidth() {
      return this.renderIndependently
        ? this.hasWindowSize && this.hasSmallWidth
          ? this.clientWidth * 0.85
          : 1080
        : 'inherit'
    },
    width() {
      return this.renderIndependently ? this.windowWidth : 'inherit'
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

<style scoped lang="scss">
.polar-plugin-attributions-footer {
  margin: 4px;
}
.polar-plugin-attributions-footer .v-card__text {
  font-size: 10px;
  padding: 2px;
  line-height: 1.1;
}
</style>
