<template>
  <div>
    <div
      v-if="!hasWindowSize || !hasSmallWidth"
      class="polar-plugin-gfi-button-container"
    >
      <v-btn
        id="polar-plugin-gfi-close-button"
        icon
        small
        :aria-label="$t(closeLabel)"
        @click="close(true)"
      >
        <v-icon>fa-xmark</v-icon>
      </v-btn>
    </div>
    <v-simple-table class="polar-edgy-table" dense>
      <template #default>
        <FeatureTableHead></FeatureTableHead>
        <FeatureTableBody></FeatureTableBody>
      </template>
    </v-simple-table>
    <FeatureButtonGroup
      v-if="exportProperty || showSwitchButtons"
      :export-property="exportProperty"
    ></FeatureButtonGroup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import FeatureButtonGroup from './FeatureButtonGroup.vue'
import FeatureTableBody from './FeatureTableBody.vue'
import FeatureTableHead from './FeatureTableHead.vue'

export default Vue.extend({
  name: 'GfiFeature',
  components: {
    FeatureButtonGroup,
    FeatureTableBody,
    FeatureTableHead,
  },
  props: {
    exportProperty: {
      type: String,
      default: '',
    },
  },
  data: () => ({ closeLabel: 'common:plugins.gfi.header.close' }),
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/gfi', ['showSwitchButtons']),
  },
  methods: {
    ...mapActions('plugin/gfi', ['close']),
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-gfi-button-container {
  display: grid;
  align-items: center;
  background-color: #ffffff;
  padding: 0.25em;

  #polar-plugin-gfi-close-button {
    grid-column: 3;
    justify-self: end;
  }
}

.polar-edgy-table {
  border-radius: 0;
}
</style>
