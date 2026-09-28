import type { PolarContainer } from '@polar/polar'

declare module 'vue' {
	interface GlobalComponents {
		/* eslint-disable @typescript-eslint/naming-convention */
		'polar-map': typeof PolarContainer
		/* eslint-enable @typescript-eslint/naming-convention */
	}
}
