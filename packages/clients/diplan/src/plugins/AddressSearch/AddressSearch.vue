<template>
  <v-container :style="style">
    <v-toolbar
      id="diplan-address-search-toolbar"
      :class="toolbarClass"
      height="72"
    >
      <SearchInput />
    </v-toolbar>
    <Results></Results>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Results from './Results.vue'
import SearchInput from './Input.vue'

export default Vue.extend({
  name: 'AddressSearch',
  components: {
    SearchInput,
    Results,
  },
  computed: {
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/addressSearch', ['featuresAvailable']),
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

<style lang="scss">
#diplan-address-search-toolbar {
  padding: 4px 16px 8px 16px;

  .v-toolbar__content {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.container {
  padding: 12px;
}
</style>
