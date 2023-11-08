<template>
  <h1 class="polar-plugin-header">
    {{ $t('common:plugins.dish.header.text') }}
  </h1>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DishHeader',
})
</script>

<style lang="scss" scoped>
.polar-plugin-header {
  position: fixed;
  top: 0;
  left: 0;

  pointer-events: all;

  color: #ffffff;
  font-weight: initial;
  font-size: 0.8rem;
  background: #003064;
  border-radius: 0 0 10px 0;
  padding: 0.1em 2em 0.1em 0.5em;
}
</style>

<style lang="scss">
.polar-plugin-address-search-toolbar {
  margin-top: 12px;
}
</style>
