<template>
  <div id="polar-plugin-gfi-button-group">
    <div>
      <v-btn
        v-if="exportProperty"
        id="polar-plugin-gfi-export-link"
        elevation="2"
        class="ma-2 text-none reticent-button primaryContrast--text"
        color="primary"
        :href="exportProperty"
        target="_blank"
        :title="$t('plugins.gfi.property.linkTitle')"
        :aria-label="$t('plugins.gfi.property.export')"
        onmousedown="return false"
      >
        {{ $t('plugins.gfi.property.export') }}
      </v-btn>
    </div>
    <FeatureSwitchButtons v-if="showSwitchButtons"></FeatureSwitchButtons>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import FeatureSwitchButtons from './FeatureSwitchButtons.vue'

export default Vue.extend({
  name: 'GfiFeatureButtonGroup',
  components: {
    FeatureSwitchButtons,
  },
  computed: {
    ...mapGetters('plugin/gfi', ['exportProperty', 'showSwitchButtons']),
  },
})
</script>

<style lang="scss" scoped>
#polar-plugin-gfi-button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;

  #polar-plugin-gfi-export-link {
    text-decoration: none;
    color: white !important;
  }

  .reticent-button {
    font-size: 14px;
    letter-spacing: normal;
  }
}
</style>
