<template>
  <div
    v-if="renderType === 'independent'"
    class="polar-plugin-attributions-wrapper"
  >
    <AttributionContent v-if="windowIsOpen" class="mr-2"></AttributionContent>
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
    ...mapGetters('plugin/attributions', ['renderType', 'windowIsOpen']),
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
