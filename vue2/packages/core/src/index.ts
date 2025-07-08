import * as mpapi from '@masterportal/masterportalapi'
import addPlugins, { resetPlugins } from './utils/addPlugins'
import createMap from './utils/createMap'

// NOTE: This is needed to be able to properly use the export
import './monkeyCrossOrigin'
// NOTE: Allow url parameters to become headers if used like `{key=value}`
import './monkeyHeaderLoader'

export { RadioCard } from './components'
export type { MapInstance } from './types'

export type PolarCore = typeof mpapi & {
  // TODO add more
  addPlugins: typeof addPlugins
  resetPlugins: typeof resetPlugins
  createMap: typeof createMap
}

const core: PolarCore = {
  ...mpapi,
  addPlugins,
  resetPlugins,
  createMap,
}

export default core
