import type { useCoreStore } from '../stores'
import type { MapConfiguration, MasterportalApiServiceRegister } from '../types'

/**
 * Type of the POLAR map custom element (`polar-map`).
 */
export type PolarMapInstance = HTMLElement & {
	mapConfiguration: MapConfiguration
	serviceRegister: MasterportalApiServiceRegister
	store: ReturnType<typeof useCoreStore>
}
