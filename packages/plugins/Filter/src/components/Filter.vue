<template>
  <div id="polar-plugin-filter">
    <MoveHandle v-if="hasWindowSize && hasSmallWidth">
      <component :is="contentComponent"> Hello Filter! </component>
    </MoveHandle>
    <component :is="contentComponent" v-else> Hello Filter! </component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MoveHandle } from '@polar/components'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'PolarGfi',
  components: {
    MoveHandle,
  },
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    contentComponent(): Vue {
      return 'div'
    },
  },
})
</script>

<style lang="scss" scoped></style>
