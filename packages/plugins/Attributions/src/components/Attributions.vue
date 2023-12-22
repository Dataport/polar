<template>
  <div
    v-if="renderType === 'independent'"
    class="polar-plugin-attributions-wrapper"
  >
    <AttributionContent
      v-if="windowIsOpen"
      class="mr-2"
      :max-width="maxWidth"
      :width="windowWidth"
    ></AttributionContent>
    <AttributionButton></AttributionButton>
  </div>
  <AttributionContent v-else></AttributionContent>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import AttributionButton from './AttributionButton.vue'
import AttributionContent from './AttributionContent.vue'

export default Vue.extend({
  name: 'AttributionsPlugin',
  components: {
    AttributionButton,
    AttributionContent,
  },
  computed: {
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/attributions', [
      'renderType',
      'windowIsOpen',
      'windowWidth',
    ]),
    maxWidth() {
      return this.hasWindowSize && this.hasSmallWidth
        ? this.clientWidth * 0.85
        : 1080
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-attributions-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 6px;
}
</style>
