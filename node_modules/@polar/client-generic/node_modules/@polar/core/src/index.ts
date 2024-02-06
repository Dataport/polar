import * as mpapi from '@masterportal/masterportalapi/src'
import addPlugins from './utils/addPlugins'
import createMap from './utils/createMap'

// NOTE: This is needed to be able to properly use the export
import './monkeyCrossOrigin'
// NOTE: Allow url parameters to become headers if used like `{key=value}`
import './monkeyHeaderLoader'

export { NineLayout, NineLayoutTag } from './components/layouts'
export { setLayout, getLayout } from './utils/layout'

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
