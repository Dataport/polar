<template>
  <h1 class="polar-plugin-header" lang="en">
    {{ $t('common:plugins.textLocator.header.text') }}
    &nbsp;
    <v-icon x-small color="white">fa-scroll</v-icon>
    <v-icon x-small color="white">fa-magnifying-glass</v-icon>
  </h1>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TextLocatorHeader',
})
</script>

<style lang="scss" scoped>
.polar-plugin-header {
  position: fixed;
  top: 0;
  left: 0;

  display: flex;

  pointer-events: all;

  color: #ffffff;
  font-weight: initial;
  font-size: 0.8rem;
  background: #7d212b;
  border-radius: 0 0 10px 0;
  padding: 0.1em 2em 0.1em 0.5em;
}
</style>

<style lang="scss">
.polar-plugin-address-search-toolbar {
  margin-top: 12px;
}
</style>
