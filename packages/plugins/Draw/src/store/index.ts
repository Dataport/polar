import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { Feature } from 'geojson'
import { PolarModule } from '@polar/lib-custom-types'
import noop from '@repositoryname/noop'
import { DrawGetters, DrawMutations, DrawState } from '../types'
import { makeActions } from './actions'

const getInitialState = (): DrawState => ({
  mode: 'none',
  drawMode: 'Point',
  textInput: '',
  selectedSize: 0,
  featureCollection: {
    type: 'FeatureCollection',
    features: [],
  },
  selectedFeature: 1,
  selectedStrokeColor: '#000000',
})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
  // NOTE hack to keep complex objects out of vuex
  let selectedFeature = null

  const { actions, drawSource } = makeActions()

  const storeModule: PolarModule<DrawState, DrawGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions,
    getters: {
      ...generateSimpleGetters(getInitialState()),
      drawSource() {
        return drawSource
      },
      selectableDrawModes(_, { configuration }) {
        /* eslint-disable @typescript-eslint/naming-convention */
        // NOTE: Keys are directly used as technical keys for ol/interaction/Draw and are allowed to differ from the naming scheme.
        const allSelectableDrawModes = {
          Circle: 'common:plugins.draw.drawMode.circle',
          LineString: 'common:plugins.draw.drawMode.lineString',
          Point: 'common:plugins.draw.drawMode.point',
          Polygon: 'common:plugins.draw.drawMode.polygon',
          Text: 'common:plugins.draw.drawMode.text',
        }
        /* eslint-enable @typescript-eslint/naming-convention */

        // TODO: Do something different than eslint ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Text, ...defaultSelectableDrawModes } = allSelectableDrawModes

        return configuration.selectableDrawModes
          ? configuration.selectableDrawModes.reduce(
              (acc, curr) => ({ ...acc, [curr]: allSelectableDrawModes[curr] }),
              {}
            )
          : defaultSelectableDrawModes
      },
      selectedFeature: (state) => {
        noop(state.selectedFeature)
        return selectedFeature
      },
      selectableModes(_, { configuration }) {
        const includesWrite =
          configuration.selectableDrawModes?.includes('Text')
        const selectableModesDraw = {
          none: 'common:plugins.draw.mode.none',
          draw: includesWrite
            ? 'common:plugins.draw.mode.write'
            : 'common:plugins.draw.mode.draw',
          edit: 'common:plugins.draw.mode.edit',
          delete: 'common:plugins.draw.mode.delete',
        }
        return selectableModesDraw
      },
      showTextInput({ drawMode, mode }, { selectedFeature }) {
        return (
          (drawMode === 'Text' && mode === 'draw') ||
          (mode === 'edit' &&
            selectedFeature &&
            typeof selectedFeature.get('text') === 'string')
        )
      },
      showDrawOptions(
        _,
        { mode, configuration, showTextInput, selectedFeature }
      ) {
        return (
          configuration.enableOptions &&
          !showTextInput &&
          (mode === 'draw' || (mode === 'edit' && selectedFeature))
        )
      },
      configuration(_, __, ___, rootGetters) {
        return rootGetters.configuration.draw || {}
      },
      fontSizes(_, { configuration }) {
        const { textStyle } = configuration
        if (textStyle?.font) {
          if (typeof textStyle.font === 'string') {
            return []
          }
          return textStyle.font.size ? textStyle.font.size.slice(0, 5) : [10]
        }
        return []
      },
      showSizeSlider(_, { fontSizes, showTextInput }) {
        return showTextInput && fontSizes.length > 1
      },
      textSize(_, { fontSizes, selectedSize }) {
        return fontSizes[selectedSize]
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
      updateFeatures(state) {
        const features = drawSource.getFeatures().map((feature) => {
          const geometry = feature.getGeometry()
          const type = geometry.getType()
          const isCircle = type === 'Circle'
          const jsonFeature: Feature = {
            type: 'Feature',
            properties: feature.get('text')
              ? { text: feature.get('text') }
              : {},
            geometry: {
              type: isCircle ? 'Point' : type,
              coordinates: isCircle
                ? geometry.getCenter()
                : geometry.getCoordinates(),
            },
          }
          // NOTE: If one is checking if properties exists (which it clearly does), TS complains
          // "TS2531: Object is possibly 'null'.". This is due to the structure of the type GeoJsonProperties.
          if (isCircle && jsonFeature.properties) {
            jsonFeature.properties.radius = geometry.getRadius()
          }
          return jsonFeature
        })
        state.featureCollection = { ...state.featureCollection, features }
      },
      setSelectedFeature: (state, payload) => {
        selectedFeature = payload
        state.selectedFeature = state.selectedFeature + 1
      },
    } as DrawMutations,
  }

  return storeModule
}
