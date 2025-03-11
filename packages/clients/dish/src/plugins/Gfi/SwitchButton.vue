<template>
  <div id="dish-gfi-switch-buttons-group">
    <v-btn
      :disabled="visibleWindowFeatureIndex <= 0"
      elevation="2"
      class="ma-2 dish-gfi-switch-button"
      fab
      x-small
      :aria-label="$t('plugins.gfi.switch.previous')"
      @click="switchFeature(-1)"
    >
      <v-icon color="white">fa-chevron-left</v-icon>
    </v-btn>
    <v-btn
      :disabled="visibleWindowFeatureIndex === windowFeatures.length - 2"
      elevation="2"
      class="ma-2 dish-gfi-switch-button"
      fab
      x-small
      :aria-label="$t('plugins.gfi.switch.next')"
      @click="switchFeature(1)"
    >
      <v-icon color="white">fa-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

type GfiIndexStep = -1 | 1

export default Vue.extend({
  name: 'SwitchButton',
  computed: {
    ...mapGetters('plugin/gfi', [
      'windowFeatures',
      'visibleWindowFeatureIndex',
    ]),
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

      const maxIndex = windowFeatures.length - 2
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

<style lang="scss" scoped>
#dish-gfi-switch-buttons-group {
  display: flex;
  justify-content: right;
}

.dish-gfi-switch-button {
  background-color: #003064 !important; // shBlue
}
</style>
