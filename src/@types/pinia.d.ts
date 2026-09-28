import 'pinia'
import type { Pinia } from 'pinia'

declare module 'pinia' {
	export interface PiniaCustomProperties {
		/* eslint-disable @typescript-eslint/naming-convention */

		/**
		 * @privateRemarks
		 * Using the saveInstance plugin, the pinia instance is auto-saved here.
		 */
		_instance: Pinia

		/* eslint-enable @typescript-eslint/naming-convention */
	}
}
