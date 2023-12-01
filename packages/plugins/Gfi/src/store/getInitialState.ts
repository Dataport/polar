import { GfiState } from '../types'

const getInitialState = (): GfiState => ({
  featureInformation: {},
  visibleWindowFeatureIndex: 0,
  visibilityChangeIndicator: 0,
  defaultHighlightStyle: {
    stroke: {
      color: '#003064',
      width: 3,
    },
    fill: {
      color: 'rgb(255, 255, 255, 0.7)',
    },
  },
  page: 0,
})

export default getInitialState
