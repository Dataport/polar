import { Resource } from 'i18next'

const en: Resource = {
  common: {
    canvas: {
      label: 'Map application',
    },
    error: {
      serviceUnavailable:
        'Service  "{{serviceName}}" (ID: {{serviceId}}) is unavailable. This may limit the map\'s functionality.',
    },
    overlay: {
      noControlOnZoom: 'Use Ctrl+Mousewheel to zoom into the map',
      oneFingerPan: 'Use at least two fingers to pan the map',
    },
  },
}
export default en
