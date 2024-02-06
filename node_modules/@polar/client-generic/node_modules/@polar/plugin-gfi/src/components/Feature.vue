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
        <FeatureTableBody
          :current-properties="currentProperties"
          :photo-height="photoHeight"
        ></FeatureTableBody>
      </template>
    </v-simple-table>
    <FeatureButtonGroup
      v-if="exportProperty || showSwitchButtons"
      :export-property="exportProperty"
      :show-switch-buttons="showSwitchButtons"
    ></FeatureButtonGroup>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { GeoJsonProperties } from 'geojson'
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
    currentProperties: {
      type: Object as PropType<GeoJsonProperties>,
      required: true,
    },
    clientWidth: {
      type: Number,
      required: true,
    },
    exportProperty: {
      type: String,
      default: '',
    },
    showSwitchButtons: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({ closeLabel: 'common:plugins.gfi.header.close' }),
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    photoHeight(): number {
      return this.clientWidth * 0.15
    },
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
