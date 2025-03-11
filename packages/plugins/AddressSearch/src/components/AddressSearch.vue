<template>
  <component :is="component" v-if="component" />
  <v-container v-else :style="style">
    <v-toolbar
      class="polar-plugin-address-search-toolbar pt-1"
      :class="toolbarClass"
      height="72"
    >
      <GroupSelect></GroupSelect>
      <SearchInput />
    </v-toolbar>
    <Results></Results>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import GroupSelect from './GroupSelect.vue'
import Results from './Results.vue'
import SearchInput from './Input.vue'

export default Vue.extend({
  name: 'AddressSearch',
  components: {
    GroupSelect,
    SearchInput,
    Results,
  },
  computed: {
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/addressSearch', ['component', 'featuresAvailable']),
    style(): string {
      return this.hasWindowSize && this.hasSmallWidth
        ? `max-width: ${this.clientWidth * 0.75}px`
        : ''
    },
    toolbarClass(): string {
      return this.featuresAvailable ? 'rounded-t-xl' : 'rounded-xl'
    },
  },
})
</script>
