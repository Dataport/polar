<template>
  <div class="polar-alert-invert">
    <v-alert
      v-for="(toast, index) of toasts"
      :key="toast.type + '-' + index + '-' + toast.text"
      dismissible
      dense
      class="v-alert"
      :close-label="$t('plugins.toast.close')"
      :type="toast.type"
      :color="toast.color"
      :icon="toast.icon"
      @input="removeToast(toast)"
    >
      {{ $t(toast.text) }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'PolarToast',
  computed: {
    ...mapGetters('plugin/toast', ['toasts', 'types']),
  },
  methods: {
    ...mapMutations('plugin/toast', ['removeToast']),
    ...mapActions('plugin/toast', ['addToast']),
  },
})
</script>

<style lang="scss" scoped>
.polar-alert-invert {
  display: flex;
  flex-direction: column;
  /* grow sideways above other elements (temporary/important) */
  z-index: 1;
  min-width: 200%;
}
.polar-alert-invert::v-deep .v-btn:hover {
  border: solid #000000 !important;
  outline: solid #ffffff;
}
</style>
