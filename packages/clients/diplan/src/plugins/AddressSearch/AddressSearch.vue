<template>
  <SearchContainer id="diplan-search-container" />
</template>

<script lang="ts">
import Vue from 'vue'
// TODO: This import should be changed in the future
import { SearchContainer } from '@polar/plugin-address-search'

export default Vue.extend({
  name: 'DiplanAddressSearch',
  components: {
    SearchContainer,
  },
})
</script>

<style lang="scss">
#diplan-search-container {
  z-index: 1;
  .v-toolbar {
    padding: 4px 16px 8px 16px;

    .v-toolbar__content {
      padding: 0 !important;
    }
  }
}
</style>

<style lang="scss" scoped>
#diplan-search-container {
  padding: 12px;
}
</style>
