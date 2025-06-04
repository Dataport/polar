<template>
  <component :is="component" v-if="component" />
  <ZoomButtonContainer v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ZoomZoomButtonContainer from './ZoomButtonContainer.vue'

export default Vue.extend({
  name: 'PolarZoom',
  components: { ZoomButtonContainer: ZoomZoomButtonContainer },
  computed: {
    ...mapGetters('plugin/zoom', ['component']),
  },
})
</script>

<style lang="scss" scoped></style>
