import type { Coordinate } from 'ol/coordinate'

import type { Icon } from './theme'

// TODO(dopenguin): Add proper description
export interface ContextMenuEntry {
	callback: (coordinate: Coordinate) => void
	icon: Icon
	id: string
	text: string
}
