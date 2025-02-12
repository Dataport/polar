<template>
  <div>
    <div
      ref="rectangle"
      :class="showOverlay ? 'rectangle_active' : 'rectangle_inactive'"
    ></div>
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          :disabled="!hasObjectProperties"
          elevation="2"
          class="ma-2"
          color="primary"
          fab
          aria-label="Kartendruck"
          v-bind="attrs"
          v-on="on"
          @click="
            showRectangleAndDialog()
            setTitle()
          "
        >
          <v-icon>fa-regular fa-file-pdf</v-icon>
        </v-btn>
      </template>
      <span>{{
        hasObjectProperties
          ? $t('plugins.dish.exportPDF.tooltip')
          : $t('plugins.dish.exportPDF.userInfo')
      }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-text>
          <v-text-field v-model="title" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              dialog = false
              showOverlay = false
            "
            >{{ $t('plugins.dish.exportPDF.buttonCancel') }}</v-btn
          >
          <v-btn text @click="printMapAsPdf">{{
            $t('plugins.dish.exportPDF.buttonPrint')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Overlay from 'ol/Overlay'
import { denkmaelerWMS, denkmaelerWFS } from '../../servicesConstants'

const rectangleWidth = 893
const rectangleHeight = 473

export default Vue.extend({
  name: 'DishExportMap',
  data: () => ({
    overlay: null as Overlay | null,
    showOverlay: false,
    dialog: false,
    title: '',
    printImageUrlProd: '',
    exportMapAsPdfUrl: '',
    wmsLayerUrl: '',
    wfsLayerUrl: '',
    wfsLayerFeatureType: '',
  }),
  computed: {
    ...mapGetters(['map', 'configuration']),
    ...mapGetters('plugin/layerChooser', ['activeBackgroundId']),
    ...mapGetters('plugin/pins', ['transformedCoordinate']),
    ...mapGetters('plugin/gfi', ['currentProperties']),
    ...mapGetters('plugin/scale', ['scaleValue', 'scaleWithUnit']),
    hasObjectProperties(): boolean {
      return this.currentProperties && this.currentProperties.objektid
    },
    backgroundLayer() {
      return this.configuration.layerConf.find(
        (layer) => layer.id === this.activeBackgroundId
      )
    },
  },
  mounted() {
    this.configureSettings()
    const element = this.$refs.rectangle as HTMLElement
    if (!this.overlay) {
      this.overlay = new Overlay({
        id: 'export-overlay',
        element,
        positioning: 'center-center',
        stopEvent: false,
      })
      this.map.addOverlay(this.overlay)
    }
  },
  methods: {
    configureSettings() {
      this.wmsLayerUrl ||= this.configuration.layerConf.find(
        (layer) => layer.id === denkmaelerWMS
      ).url
      const wfsLayer = this.configuration.layerConf.find(
        (layer) => layer.id === denkmaelerWFS
      )
      this.wfsLayerUrl = wfsLayer.url
      this.wfsLayerFeatureType = wfsLayer.featureType
      this.printImageUrlProd ||= `${this.configuration.dishExportMap.internalHost}/Content/MapsTmp`
      this.exportMapAsPdfUrl ||= `${this.configuration.dishExportMap.internalHost}/Content/Objekt/Kartenausgabe.aspx`
    },
    showRectangleAndDialog() {
      if (this.transformedCoordinate.length === 0 || !this.overlay) {
        return
      }
      this.showOverlay = true
      this.dialog = true
    },
    setTitle() {
      if (this.overlay && this.hasObjectProperties) {
        const objectId = this.currentProperties.objektid
        const address = [
          this.currentProperties.strasse,
          this.currentProperties.hausnummer,
          this.currentProperties.hausnrzusatz,
        ]
          .join(' ')
          .trim()
        this.title = `${this.currentProperties.gemeinde}, ${address}, ${this.currentProperties.objektansprache}, ONR ${objectId}`
        this.overlay.setPosition(this.transformedCoordinate)
      }
    },
    getRectangleCoordinates() {
      const centerPixel = this.map.getPixelFromCoordinate(
        this.transformedCoordinate
      )
      const topLeftPixel = [
        centerPixel[0] - rectangleWidth / 2,
        centerPixel[1] - rectangleHeight / 2,
      ]
      const bottomRightPixel = [
        centerPixel[0] + rectangleWidth / 2,
        centerPixel[1] + rectangleHeight / 2,
      ]
      const topLeft = this.map.getCoordinateFromPixel(topLeftPixel)
      const bottomRight = this.map.getCoordinateFromPixel(bottomRightPixel)

      return {
        xMin: topLeft[0],
        xMax: bottomRight[0],
        yMin: topLeft[1],
        yMax: bottomRight[1],
      }
    },
    getPrintParams() {
      if (!this.transformedCoordinate) {
        console.error(
          '@polar/client-dish: Center coordinates are undefined. Print aborted.'
        )
        return
      }
      const backgroundLayer = this.backgroundLayer
      const bbox = this.getRectangleCoordinates()
      return {
        NewTab: true,
        objektueberschrift: this.title,
        // spelling is intentional because of backend requirements
        masssstab: this.scaleValue,
        printApproach: 'scale',
        printRequester: 'client',
        id: this.currentProperties.objektid,
        xPrint: 18,
        yPrint: 20,
        scale: this.scaleValue,
        xMin: bbox?.xMin,
        yMin: bbox?.yMin,
        xMax: bbox?.xMax,
        yMax: bbox?.yMax,
        xCenter: this.transformedCoordinate[0],
        yCenter: this.transformedCoordinate[1],
        mapSRS: this.configuration.epsg,
        urlHintergrund: `${backgroundLayer.url}?`,
        LayerNameHintergrund: backgroundLayer.layers,
        VersionHintergrund: '1.1.1',
        ProxyHintergrund: 'y',
        urlWMS: `${this.wmsLayerUrl}?`,
        VersionWMS: '1.1.1',
        LayerNameWMS:
          '0,9,1,10,2,11,3,12,4,13,25,27,24,26,6,15,19,30,20,31,21,32,22,33,23,34,29,36,28,35',
        urlWFS: `${this.wfsLayerUrl}?`,
        VersionWFS: '1.1.0',
        LayerNameWFS: this.wfsLayerFeatureType,
        PropertyNameWFS: 'objektid',
        FilterTypeWFS: 'EQUAL_TO',
        scaleText: this.scaleWithUnit,
        PrintImageURL: this.printImageUrlProd,
        PrintImagePath: 'ContentMapsTmp',
      }
    },
    printMapAsPdf() {
      this.dialog = false
      const printParams = this.getPrintParams()
      const queryString = Object.entries(printParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&')
      const encodedUrl = `${this.exportMapAsPdfUrl}?${queryString}`

      window.open(encodedUrl, '_blank')
      this.showOverlay = false
    },
  },
})
</script>

<style lang="scss" scoped>
.rectangle_inactive {
  width: 0;
  height: 0;
}

.rectangle_active {
  width: 893px;
  height: 960px;
  border: 2px solid var(--polar-primary);
  background: rgba(255, 255, 255, 0.4);
}
</style>
