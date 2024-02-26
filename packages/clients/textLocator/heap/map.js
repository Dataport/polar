import { Feature, Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS.js'
import OSM, { ATTRIBUTION } from 'ol/source/OSM'
import { getTransform } from 'ol/proj.js'
import WKT from 'ol/format/WKT.js'
import Polygon from 'ol/geom/Polygon.js'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Overlay from 'ol/Overlay.js'
import { Fill, Stroke, Style } from 'ol/style.js'
import { Control, defaults as defaultControls } from 'ol/control.js'

const WKTfmt = new WKT()

const resultFeatureStyle = [
  new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
]
const resultVectorLayer = new VectorLayer({
  source: new VectorSource({
    features: resultFeatures,
    style: resultFeatureStyle,
  }),
})
// used to display the colored Geometries when clicking a location
const geometriesVectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [],
    style: resultFeatureStyle,
  }),
})
geometriesVectorLayer.setOpacity(0.7)

// for coloring all geometries to all locations found in a title
const titleGeometriesVectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [],
    style: resultFeatureStyle,
  }),
})
titleGeometriesVectorLayer.setOpacity(0.8)

const popupOverlay = new Overlay({
  element: popupContainer,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
})

popupCloser.onclick = function () {
  popupOverlay.setPosition(undefined)
  popupCloser.blur()
  return false

class ResetLocationGeometries extends Control {
        geometriesVectorLayer.getSource().clear()

class ResetTextGeometries extends Control {
        titleGeometriesVectorLayer.getSource().clear()

  overlays: [popupOverlay]

  showPopup(text, coordinate) {
    popupOverlay.setPosition(coordinate)
    this.popupContent.innerHTML = text

  displayUserSelectedPoly(geometry) {
    const displayPoly = geometry.clone()
    displayPoly.applyTransform(getTransform('EPSG:4326', 'EPSG:3857'))
    this.resultVectorLayer.getSource().getFeatures()[0].setGeometry(displayPoly)

  removeUserSelectedPoly() {
    this.resultVectorLayer
      .getSource()
      .getFeatures()[0]
      .setGeometry(new Polygon([]))

  displayGeometriesOnMap(geometriesList) {
    this.resultVectorLayer.getSource().clear()
    this.resultVectorLayer.setOpacity(0.45)
    geometriesList.forEach((wktGeom) => {
      const feature = WKTfmt.readFeature(wktGeom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      })
      this.resultVectorLayer.getSource().addFeature(feature)

  colorGeometries(locationName, nameGeometryDict) {
    this.geometriesVectorLayer.getSource().clear()
    const geometriesList = nameGeometryDict[locationName]
    if (geometriesList && Array.isArray(geometriesList)) {
      let geometryCounter = 0
      geometriesList.forEach((wktGeom) => {
        const style = new Style({
          fill: new Fill({
            color: colorPalette[geometryCounter],
          }),
        })
        const feature = WKTfmt.readFeature(wktGeom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        })
        feature.setStyle(style)
        this.geometriesVectorLayer.getSource().addFeature(feature)
        geometryCounter++
      })
    } else {
      console.log('No Geometries for this location')

  colorGeometriesMultipleLocations(
    article_title,
    titleLocationFreqDict,
    nameGeometryDict
  ) {
    this.titleGeometriesVectorLayer.getSource().clear()
    const locationsFreqs = titleLocationFreqDict[article_title]
    for (const locationName in locationsFreqs) {
      const geometriesList = nameGeometryDict[locationName]
      if (geometriesList && Array.isArray(geometriesList)) {
        geometriesList.forEach((wktGeom) => {
          const style = new Style({
            fill: new Fill({
              color: heatColorPalette[locationsFreqs[locationName]],
            }),
          })
          const feature = WKTfmt.readFeature(wktGeom, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          })
          feature.setStyle(style)
          this.titleGeometriesVectorLayer.getSource().addFeature(feature)
        })
      } else {
        console.log('No Geometries for this location')
