<template>
  <v-card
    v-if="infoFields.length > 0 && currentProperties"
    class="bgw-gfi-content"
  >
    <v-card-actions v-if="!hasWindowSize || !hasSmallWidth">
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        :aria-label="$t('plugins.gfi.header.close')"
        @click="close(true)"
      >
        <v-icon small>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-title class="bgw-gfi-title">
      {{ currentProperties.bgw_name }}
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <tbody>
          <tr v-for="item in info" :key="item[0]">
            <td>{{ $t(item[0]) }}</td>
            <td>{{ item[1] }}</td>
          </tr>
        </tbody>
      </v-simple-table>
      <ActionButton></ActionButton>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { Stroke, Style } from 'ol/style'
import { Feature } from 'ol'
import ActionButton from './ActionButton.vue'

export default Vue.extend({
  name: 'BgwGfiContent',
  components: { ActionButton },
  data: () => ({
    infoFields: [],
    defaultStyle: {} as Style,
    highlightStyle: {} as Style,
    badestraendeFeatures: [] as Feature[],
  }),
  computed: {
    ...mapGetters(['selected']),
    ...mapGetters(['map', 'configuration']),
    ...mapGetters('plugin/gfi', ['currentProperties']),
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    info(): Array<string[]> {
      return this.infoFields.map(({ key, label }) => [
        label,
        this.currentProperties[key],
      ])
    },
  },
  watch: {
    currentProperties(value) {
      this.updateBadestraendeStyles(null, this.defaultStyle)
      this.updateBadestraendeStyles(value.fid, this.highlightStyle)
    },
  },
  mounted() {
    this.infoFields = this.configuration.gfi.infoFields
    this.setDefaultStyle(this.map, '14001')
    this.updateBadestraendeStyles(null, this.defaultStyle)
    this.setHighlightStyle()
    this.updateBadestraendeStyles(
      this.currentProperties.fid,
      this.highlightStyle
    )
  },
  beforeDestroy() {
    if (!this.selected) this.updateBadestraendeStyles(null, this.defaultStyle)
  },
  methods: {
    ...mapActions('plugin/gfi', ['close']),
    getBadeStellenFeatures(map, layerId: string, badeStellenId: string) {
      const layer = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get('id') === layerId)

      return layer
        .getSource()
        .getFeatures()
        .filter((feature) => {
          return feature.get('BATHINGWAT') === badeStellenId
        })
    },
    updateBadestraendeStyles(id: string | null, style: Style) {
      if (id) {
        this.badestraendeFeatures = this.getBadeStellenFeatures(
          this.map,
          '14001',
          id
        )
      }
      if (this.badestraendeFeatures.length > 0) {
        this.badestraendeFeatures.forEach((feature) => feature.setStyle(style))
      }
    },
    setHighlightStyle() {
      this.highlightStyle = new Style({
        stroke: new Stroke(
          this.configuration.gfi.highlightStyleBadestraende.stroke
        ),
      })
    },
    setDefaultStyle(map, layerId) {
      const layer = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get('id') === layerId)
      this.defaultStyle =
        layer.getStyle() ||
        new Style({
          stroke: new Stroke({ color: '#FF4500', width: 3 }),
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.bgw-gfi-title {
  word-break: break-word;
  font-size: medium;
  font-weight: bold;
}
</style>
