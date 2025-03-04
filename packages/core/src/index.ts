import * as mpapi from '@masterportal/masterportalapi'
import addPlugins from './utils/addPlugins'
import createMap from './utils/createMap'

// NOTE: This is needed to be able to properly use the export
import './monkeyCrossOrigin'
// NOTE: Allow url parameters to become headers if used like `{key=value}`
import './monkeyHeaderLoader'

export { NineLayout, NineLayoutTag } from './components/layouts'
export { RadioCard } from './components'
export { setLayout, getLayout } from './utils/layout'
export { default as mpapiDefaults } from './utils/createMap/defaults'
export type { MapInstance } from './types'

export type PolarCore = typeof mpapi & {
  // TODO add more
  addPlugins: typeof addPlugins
  createMap: typeof createMap
}

const core: PolarCore = {
  ...mpapi,
  addPlugins,
  createMap,
}

export default core
