<template>
  <component :is="component" v-if="component" />
  <SearchContainer v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import SearchContainer from './SearchContainer.vue'

export default Vue.extend({
  name: 'AddressSearch',
  components: {
    SearchContainer,
  },
  computed: {
    ...mapGetters('plugin/addressSearch', ['component']),
  },
})
</script>
