<template>
  <div>
    <div class="polar-plugin-gfi-button-container">
      <v-icon
        v-if="hasWindowSize && hasSmallWidth"
        id="polar-plugin-gfi-grip-icon"
      >
        fa-grip-lines
      </v-icon>
      <v-btn
        id="polar-plugin-gfi-close-button"
        icon
        small
        :aria-label="$t(closeLabel)"
        @click="close"
      >
        <v-icon>fa-xmark</v-icon>
      </v-btn>
    </div>
    <v-simple-table class="polar-edgy-table" dense>
      <template #default>
        <GfiHead></GfiHead>
        <GfiBody
          :current-properties="currentProperties"
          :photo-height="photoHeight"
        ></GfiBody>
      </template>
    </v-simple-table>
    <GfiButtonGroup
      v-if="exportProperty || showSwitchButtons"
      :export-property="exportProperty"
      :show-switch-buttons="showSwitchButtons"
    ></GfiButtonGroup>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { GeoJsonProperties } from 'geojson'
import { mapActions, mapGetters } from 'vuex'
import GfiButtonGroup from './GfiButtonGroup.vue'
import GfiBody from './GfiBody.vue'
import GfiHead from './GfiHead.vue'

export default Vue.extend({
  name: 'GfiContent',
  components: {
    GfiButtonGroup,
    GfiBody,
    GfiHead,
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

  #polar-plugin-gfi-grip-icon {
    grid-column: 2;
    justify-self: center;
  }
  #polar-plugin-gfi-close-button {
    grid-column: 3;
    justify-self: end;
  }
}

.polar-edgy-table {
  border-radius: 0;
}
</style>
