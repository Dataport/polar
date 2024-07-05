<template>
  <div v-if="showLoader">
    <v-card>
      <v-card-text>
        {{ $t('common:plugins.loadingIndicator.loading') }}
        <v-progress-linear indeterminate color="primary" class="mb-0" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'LoadingIndicator',
  computed: {
    ...mapGetters('plugin/loadingIndicator', ['showLoader']),
  },
})
</script>

<style lang="scss" scoped></style>
