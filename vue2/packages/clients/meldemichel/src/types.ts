import { MODE } from './enums'

export interface MeldemichelCreateMapParams {
  containerId: string
  mode: keyof typeof MODE
  afmUrl?: string
  stadtwaldActive?: boolean
  reportServiceId?: string
  configOverride?: object
}
