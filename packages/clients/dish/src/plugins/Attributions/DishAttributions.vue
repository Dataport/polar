<template>
  <div
    v-if="renderType === 'independent'"
    class="polar-plugin-attributions-wrapper"
    :class="{ 'open-left': openLeft }"
  >
    <component :is="buttonComponent" />
    <DishAttributionContent v-if="windowIsOpen" />
  </div>
  <DishAttributionContent v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import DishAttributionContent from './DishAttributionContent.vue'

export default Vue.extend({
  name: 'DishAttributions',
  components: {
    DishAttributionContent,
  },
  computed: {
    ...mapGetters('plugin/attributions', [
      'buttonComponent',
      'configuration',
      'renderType',
      'windowIsOpen',
    ]),
    openLeft(): boolean {
      return this.configuration.layoutTag?.includes('right') ?? false
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-attributions-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 6px;
  gap: 8px;

  &.open-left {
    flex-direction: row-reverse;
  }
}
</style>
