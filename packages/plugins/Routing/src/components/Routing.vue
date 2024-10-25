vue
<template>
  <div id="routing-tool"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'Routing',
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/routing', []),
  },
  mounted() {
    this.setupModule()
  },
  methods: {
    ...mapActions('plugin/routing', ['setupModule']),
  },
})
</script>

<style></style>
