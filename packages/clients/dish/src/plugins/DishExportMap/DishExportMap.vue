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
          ? $t('common:plugins.dish.exportPDF.tooltip')
          : $t('common:plugins.dish.exportPDF.userInfo')
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
            >{{ $t('common:plugins.dish.exportPDF.buttonCancel') }}</v-btn
          >
          <v-btn text @click="printMapAsPdf">{{
            $t('common:plugins.dish.exportPDF.buttonPrint')
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

export default Vue.extend({
  name: 'DishExportMap',
  data: () => ({
    overlay: null as Overlay | null,
    showOverlay: false,
    rectangleWidth: 893,
    rectangleHeight: 473,
    dialog: false,
    title: '',
    printImageUrlProd: '',
    exportMapAsPdfUrl: '',
    wmsLayerUrl: '',
    wfsLayerUrl: '',
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
  },
  mounted() {
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
    getBackgroundLayer() {
      return this.configuration.layerConf.find(
        (layer) => layer.id === this.activeBackgroundId
      )
    },
    setUrlsFromConfig() {
      this.wmsLayerUrl ||= this.configuration.layerConf.find(
        (layer) => layer.id === denkmaelerWMS
      ).url
      this.wfsLayerUrl ||= this.configuration.layerConf.find(
        (layer) => layer.id === denkmaelerWFS
      ).url
      this.printImageUrlProd ||= `${this.configuration.dishExportMap.internalHost}/Content/MapsTmp`
      this.exportMapAsPdfUrl ||= `${this.configuration.dishExportMap.internalHost}/Content/Objekt/Kartenausgabe.aspx`
    },
    showRectangleAndDialog() {
      if (
        !this.transformedCoordinate ||
        this.transformedCoordinate.length === 0
      ) {
        return
      }
      if (this.overlay) {
        this.showOverlay = true
        this.dialog = true
      }
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
      if (this.transformedCoordinate) {
        const centerPixel = this.map.getPixelFromCoordinate(
          this.transformedCoordinate
        )
        const topLeftPixel = [
          centerPixel[0] - this.rectangleWidth / 2,
          centerPixel[1] - this.rectangleHeight / 2,
        ]
        const bottomRightPixel = [
          centerPixel[0] + this.rectangleWidth / 2,
          centerPixel[1] + this.rectangleHeight / 2,
        ]
        const topLeft = this.map.getCoordinateFromPixel(topLeftPixel)
        const bottomRight = this.map.getCoordinateFromPixel(bottomRightPixel)

        return {
          xMin: topLeft[0],
          xMax: bottomRight[0],
          yMin: topLeft[1],
          yMax: bottomRight[1],
        }
      }
      console.error('Center coordinates are undefined.')
    },
    getPrintParams() {
      const backgroundLayer = this.getBackgroundLayer()
      const bbox = this.getRectangleCoordinates()
      return {
        NewTab: true,
        objektueberschrift: this.title,
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
        LayerNameWFS: 'TBLGIS_ORA',
        PropertyNameWFS: 'objektid',
        FilterTypeWFS: 'EQUAL_TO',
        scaleText: this.scaleWithUnit,
        proxyURL: 'zs-proxy.dataport.de:3128',
        PrintImageURL: this.printImageUrlProd,
        PrintImagePath: 'ContentMapsTmp',
      }
    },
    printMapAsPdf() {
      this.setUrlsFromConfig()
      this.dialog = false
      const printParams = this.getPrintParams()
      const queryString = Object.keys(printParams)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(printParams[key])}`
        )
        .join('&')
      const encodedUrl = `${this.exportMapAsPdfUrl}?${queryString}`

      window.open(encodedUrl, '_blank')
      this.showOverlay = false
    },
  },
})
</script>

<style scoped>
.rectangle_inactive {
  width: 0px;
  height: 0px;
}

.rectangle_active {
  width: 893px;
  height: 960px;
  border: 2px solid var(--polar-primary);
  background: rgba(255, 255, 255, 0.4);
}
</style>
