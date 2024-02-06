<template>
  <component
    :is="pluginContainer.plugin"
    v-bind="pluginContainer.options.props"
    class="polar-clickable"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    pluginContainer: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style lang="scss">
.polar-clickable > * {
  pointer-events: all;
}
</style>
