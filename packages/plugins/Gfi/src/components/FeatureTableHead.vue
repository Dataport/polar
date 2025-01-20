<template>
  <thead>
    <tr>
      <th class="text-left">{{ $t('plugins.gfi.header.field') }}</th>
      <th class="text-left">{{ $t('plugins.gfi.header.value') }}</th>
    </tr>
  </thead>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'GfiFeatureTableHead',
})
</script>

<style lang="scss" scoped></style>
