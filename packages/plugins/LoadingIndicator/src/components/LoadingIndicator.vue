<template>
  <DefaultIndicator :show-loader="showLoader" />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import DefaultIndicator from './DefaultIndicator.vue'

export default Vue.extend({
  name: 'LoadingIndicator',
  components: { DefaultIndicator },
  computed: {
    ...mapGetters('plugin/loadingIndicator', ['showLoader']),
  },
})
</script>

<style lang="scss" scoped></style>
