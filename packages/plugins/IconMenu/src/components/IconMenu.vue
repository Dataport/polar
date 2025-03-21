<template>
  <component :is="component" v-if="component" />
  <IconMenuWrapper v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import IconMenuWrapper from './IconMenuWrapper.vue'

export default Vue.extend({
  name: 'IconMenu',
  components: { IconMenuWrapper },
  computed: {
    ...mapGetters('plugin/iconMenu', ['component']),
  },
})
</script>

<style lang="scss" scoped></style>
