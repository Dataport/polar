<template>
  <v-card>test</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'GeometrySearchPlugin',
  computed: {
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
  },
})
</script>

<style lang="scss" scoped></style>
