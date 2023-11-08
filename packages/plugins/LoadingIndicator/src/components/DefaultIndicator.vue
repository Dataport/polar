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

<script>
export default {
  name: 'DefaultIndicator',
  props: {
    showLoader: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped></style>
