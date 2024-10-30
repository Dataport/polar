<template>
  <div id="dish-export-button">
    <div
      ref="rectangle"
      :class="showOverlay ? 'rectangle_active' : 'rectangle_inactive'"
    ></div>
    <v-btn
      elevation="2"
      class="ma-2"
      color="primary"
      fab
      aria-label="Kartendruck"
      @click="createURLforPrint()"
    >
      <v-icon>fa-regular fa-file-pdf</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Overlay from 'ol/Overlay'

export default Vue.extend({
  name: 'DishExportMap',
  data: () => ({
    exportBaseUrl:
      'http://10.61.63.54/Content/Objekt/Kartenausgabe.aspx?NewTab=true&objektueberschrift=',
    overlay: null as Overlay | null,
    showOverlay: false,
    rectangleWidth: 893,
    rectangleHeight: 473,
  }),
  computed: {
    ...mapGetters(['map', 'configuration']),
    ...mapGetters('plugin/pins', ['transformedCoordinate']),
    ...mapGetters('plugin/layerChooser', [
      'activeLayerIds',
      'activeBackgroundId',
      'activeMaskIds',
    ]),
    ...mapGetters('plugin/gfi', ['currentProperties']),
    ...mapGetters('plugin/scale', ['scaleValue', 'scaleWithUnit']),
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
    showRectangle() {
      if (
        !this.transformedCoordinate ||
        this.transformedCoordinate.length === 0
      ) {
        return
      }
      if (this.overlay && this.transformedCoordinate) {
        this.showOverlay = true
        this.overlay.setPosition(this.transformedCoordinate)
      }
    },
    getRectangleCoordinates() {
      if (this.transformedCoordinate && this.overlay) {
        const element = this.overlay.getElement()
        if (element) {
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
      }
    },
    // eslint-disable-next-line max-lines-per-function
    createURLforPrint() {
      this.showRectangle()
      const bbox = this.getRectangleCoordinates()
      let objInfos = ''
      let objectId = ''
      if (this.currentProperties.objektid) {
        objectId = this.currentProperties.objektid
        const address = [
          this.currentProperties.strasse,
          this.currentProperties.hausnummer,
          this.currentProperties.hausnrzusatz,
        ]
          .join(' ')
          .trim()
        objInfos = `${this.currentProperties.gemeinde}, ${address}, ${this.currentProperties.objektansprache}, ONR ${objectId}`
      } else {
        console.warn('currentProperties is undefined')
        // TODO Toast Information
        return
      }
      const baseUrl = 'http://10.61.63.54/Content/Objekt/Kartenausgabe.aspx'
      const printParams = {
        NewTab: true,
        objektueberschrift: objInfos,
        masssstab: this.scaleValue,
        printApproach: 'scale',
        printRequester: 'client',
        id: objectId,
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
        urlHintergrund: 'https://sgx.geodatenzentrum.de/wms_basemapde?',
        LayerNameHintergrund: 'de_basemapde_web_raster_grau',
        VersionHintergrund: '1.1.1',
        ProxyHintergrund: 'y',
        urlWMS: 'http://10.61.63.54:8081/dish-deegree-3.5.0//services/wms?',
        VersionWMS: '1.1.1',
        LayerNameWMS:
          '0,9,1,10,2,11,3,12,4,13,25,27,24,26,6,15,19,30,20,31,21,32,22,33,23,34,29,36,28,35',
        urlWFS: 'http://10.61.63.54:8081/dish-deegree-3.5.0/services/wfs?',
        VersionWFS: '1.1.0',
        LayerNameWFS: 'TBLGIS_ORA',
        PropertyNameWFS: 'objektid',
        FilterTypeWFS: 'EQUAL_TO',
        scaleText: this.scaleWithUnit,
        proxyURL: 'zs-proxy.dataport.de:3128',
        PrintImageURL: 'http://10.61.134.23/Content/MapsTmp',
        PrintImagePath: 'ContentMapsTmp',
      }
      const queryString = Object.keys(printParams)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(printParams[key])}`
        )
        .join('&')
      const encodedUrl = `${baseUrl}?${queryString}`

      console.warn(encodedUrl)
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
