<template>
  <thead>
    <tr>
      <th class="text-left">{{ $t('common:plugins.gfi.header.field') }}</th>
      <th class="text-left">{{ $t('common:plugins.gfi.header.value') }}</th>
    </tr>
  </thead>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'GfiHead',
})
</script>

<style lang="scss" scoped></style>
