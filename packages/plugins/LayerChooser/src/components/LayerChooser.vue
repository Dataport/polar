<template>
  <v-scroll-x-reverse-transition>
    <Selection v-if="displaySelection"></Selection>
    <Options v-else></Options>
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
  },
})
</script>
