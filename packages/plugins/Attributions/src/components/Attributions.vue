<template>
  <div
    v-if="renderType === 'independent'"
    class="polar-plugin-attributions-wrapper"
  >
    <template v-if="openLeft">
      <AttributionContent v-if="windowIsOpen" class="mr-2" />
      <AttributionButton />
    </template>
    <template v-else>
      <AttributionButton />
      <AttributionContent v-if="windowIsOpen" class="ml-2" />
    </template>
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
    ...mapGetters('plugin/attributions', [
      'configuration',
      'renderType',
      'windowIsOpen',
    ]),
    // If the button is rendered independent and on the right, the content should be opened to the left
    openLeft() {
      return this.configuration.layoutTag?.includes('right')
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
