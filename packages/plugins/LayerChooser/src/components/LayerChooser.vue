<template>
  <v-scroll-x-reverse-transition>
    <!-- x-scroll-x-reverse-transition seems to require single child -->
    <div>
      <Selection v-if="displaySelection" :max-width="maxWidth"></Selection>
      <Options v-else :max-width="maxWidth"></Options>
    </div>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Options from './Options.vue'
import Selection from './Selection.vue'

export default Vue.extend({
  name: 'LayerChooser',
  components: {
    Options,
    Selection,
  },
  computed: {
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/layerChooser', ['openedOptions']),
    displaySelection() {
      return this.openedOptions === null
    },
    maxWidth(): number {
      return (
        this.clientWidth * (this.hasWindowSize && this.hasSmallWidth ? 0.75 : 1)
      )
    },
  },
})
</script>
