import { MODE } from './enums'

export interface MeldemichelCreateMapParams {
  containerId: string
  mode: keyof typeof MODE
  afmUrl?: string
  reportServiceId?: string
  configOverride?: object
}
