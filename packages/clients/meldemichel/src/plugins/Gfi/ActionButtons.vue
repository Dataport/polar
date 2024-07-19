<template>
  <div v-if="showSwitchButtons">
    <v-btn
      icon
      :small="showSmall"
      :aria-label="$t('common:plugins.gfi.switch.previous')"
      @click="switchFeature(-1)"
    >
      <v-icon :small="showSmall">fa-arrow-left-long</v-icon>
    </v-btn>
    <v-btn
      icon
      :small="showSmall"
      :aria-label="$t('common:plugins.gfi.switch.next')"
      @click="switchFeature(1)"
    >
      <v-icon :small="showSmall">fa-arrow-right-long</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

type GfiIndexStep = -1 | 1

export default Vue.extend({
  name: 'MeldemichelGfiFeatureActionButtons',
  computed: {
    ...mapGetters('plugin/gfi', [
      'showSwitchButtons',
      'visibleWindowFeatureIndex',
      'windowFeatures',
    ]),
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    showSmall(): boolean {
      return !this.hasWindowSize || !this.hasSmallWidth
    },
  },
  methods: {
    ...mapMutations('plugin/gfi', ['setVisibleWindowFeatureIndex']),
    /** switch to next or previous feature */
    switchFeature(by: GfiIndexStep): void {
      const {
        visibleWindowFeatureIndex,
        windowFeatures,
        setVisibleWindowFeatureIndex,
      } = this
      const maxIndex = windowFeatures.length - 1
      const nextIndex = visibleWindowFeatureIndex + by
      if (nextIndex < 0) {
        setVisibleWindowFeatureIndex(windowFeatures.length - 1)
        return
      }
      if (nextIndex > maxIndex) {
        setVisibleWindowFeatureIndex(0)
        return
      }
      setVisibleWindowFeatureIndex(nextIndex)
    },
  },
})
</script>

<style scoped lang="scss">
.v-icon {
  color: var(--polar-primary) !important;
}
</style>
