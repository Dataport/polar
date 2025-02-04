<template>
  <div v-if="showLoader">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row justify="center">
            {{ $t('plugins.loadingIndicator.loading') }}
          </v-row>
          <v-row v-if="loaderStyle !== 'none'">
            <component
              :is="loaderStyle"
              indeterminate
              color="primary"
              class="mb-0"
            />
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import RollerLoader from './loaderStyles/Roller.vue'
import CircleLoader from './loaderStyles/Circle.vue'
import SpinnerLoader from './loaderStyles/Spinner.vue'
import RingLoader from './loaderStyles/Ring.vue'
import BasicLoader from './loaderStyles/Basic.vue'

export default Vue.extend({
  name: 'LoadingIndicator',
  components: {
    RollerLoader,
    CircleLoader,
    SpinnerLoader,
    RingLoader,
    BasicLoader,
  },
  computed: {
    ...mapGetters('plugin/loadingIndicator', ['showLoader', 'loaderStyle']),
  },
})
</script>

<style lang="scss" scoped></style>
