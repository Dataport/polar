<template>
  <div v-if="showLoader">
    <v-card>
      <v-card-text>
        <v-row justify="center">
          {{ $t('common:plugins.loadingIndicator.loading') }}
        </v-row>
        <v-row v-if="loaderStyle !== 'none'">
          <component
            :is="loaderStyle"
            indeterminate
            color="primary"
            class="mb-0"
          />
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import RollerStyleLoader from './loaderStyles/Roller.vue'
import CircleStyleLoader from './loaderStyles/Circle.vue'
import SpinnerStyleLoader from './loaderStyles/Spinner.vue'
import RingStyleLoader from './loaderStyles/Ring.vue'
import DefaultStyleLoader from './loaderStyles/Default.vue'

export default Vue.extend({
  name: 'LoadingIndicator',
  components: {
    RollerStyleLoader,
    CircleStyleLoader,
    SpinnerStyleLoader,
    RingStyleLoader,
    DefaultStyleLoader,
  },
  computed: {
    ...mapGetters('plugin/loadingIndicator', ['showLoader', 'loaderStyle']),
  },
})
</script>

<style lang="scss" scoped></style>
