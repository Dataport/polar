<template>
  <div
    v-if="renderType === 'independent'"
    class="polar-plugin-attributions-wrapper"
  >
    <template v-if="openLeft">
      <DishAttributionContent v-if="windowIsOpen" class="mr-2" />
      <component :is="buttonComponent" />
    </template>
    <template v-else>
      <component :is="buttonComponent" />
      <DishAttributionContent v-if="windowIsOpen" class="ml-2" />
    </template>
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
