<template>
  <SharedContent :show-gfi="showGfi">
    <MonumentContent></MonumentContent>
    <SwitchButton v-if="showDishSwitchButtons"></SwitchButton>
  </SharedContent>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { denkmaelerWMS, alkisWms } from '../../servicesConstants'
import SharedContent from './SharedContent.vue'
import SwitchButton from './SwitchButton.vue'
import MonumentContent from './MonumentContent.vue'

export default Vue.extend({
  name: 'DishGfiIntern',
  components: {
    SharedContent,
    SwitchButton,
    MonumentContent,
  },
  data: () => ({}),
  computed: {
    ...mapGetters('plugin/gfi', ['currentProperties', 'windowFeatures']),
    ...mapGetters('plugin/layerChooser', ['activeMaskIds']),
    objektIdentifier(): boolean {
      return Boolean(this.currentProperties.objektid)
    },
    showDishSwitchButtons(): boolean {
      if (
        this.showInfoForActiveLayers('alkis') &&
        !this.showInfoForActiveLayers('monument')
      ) {
        return false
      }
      return this.windowFeatures.length > 2
    },
    showGfi(): boolean {
      return (
        (this.showInfoForActiveLayers('monument') && this.objektIdentifier) ||
        this.showInfoForActiveLayers('alkis')
      )
    },
  },
  watch: {
    windowFeatures() {
      this.setVisibleWindowFeatureIndex(0)
    },
  },
  methods: {
    ...mapMutations('plugin/gfi', ['setVisibleWindowFeatureIndex']),
    showInfoForActiveLayers(topic: 'alkis' | 'monument') {
      const layerMap = {
        alkis: alkisWms,
        monument: denkmaelerWMS,
      }
      const targetLayer = layerMap[topic]
      return targetLayer ? this.activeMaskIds.includes(targetLayer) : false
    },
  },
})
</script>

<style lang="scss" scoped></style>
