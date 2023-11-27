<template>
  <div id="polar-plugin-filter">
    <MoveHandle v-if="hasWindowSize && hasSmallWidth">
      <FilterContent></FilterContent>
    </MoveHandle>
    <FilterContent v-else></FilterContent>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MoveHandle } from '@polar/components'
import { mapGetters } from 'vuex'
import FilterContent from './FilterContent.vue'

export default Vue.extend({
  name: 'PolarFilter',
  components: {
    FilterContent,
    MoveHandle,
  },
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
  },
})
</script>

<style lang="scss" scoped></style>
