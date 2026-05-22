import type { Map } from 'ol'
import type { Type } from 'ol/geom/Geometry'
import type VectorLayer from 'ol/layer/Vector'
import type VectorSource from 'ol/source/Vector'

import { Draw, type Interaction } from 'ol/interaction'

import type {
	DrawMode,
	PropertyMode,
	EditMode,
	ToolMode,
	DrawPluginOptions,
} from '../../types'

import { createDrawInteraction } from './createDrawInteractions'
import { createModifyInteractions } from './createModifyInteractions'

export class InteractionManager {
	#map: Map
	#drawLayerId: string
	#drawLayer: VectorLayer | null = null
	#drawSource: VectorSource | null = null
	#currentInteractions = new Set<Interaction>()
	#configuration: DrawPluginOptions

	constructor(map: Map, configuration: DrawPluginOptions, drawLayerId: string) {
		this.#map = map
		this.#configuration = configuration
		this.#drawLayerId = drawLayerId
		this.determineDrawSource(drawLayerId)
	}

	updateDrawLayer(drawLayerId: string) {
		this.removeAllInteractions()
		this.determineDrawSource(drawLayerId)
	}

	determineDrawSource(drawLayerId: string) {
		const drawLayer = this.#map
			.getLayers()
			.getArray()
			.find((layer) => layer.get('id') === drawLayerId)

		if (!drawLayer) {
			throw new Error(`Draw layer with id ${drawLayerId} not found`)
		}

		this.#drawLayer = drawLayer as VectorLayer
		this.#drawSource = this.#drawLayer.getSource()
		this.#drawLayerId = drawLayerId
	}

	initializeInteractions(tool: ToolMode, entry?: string) {
		this.removeAllInteractions()

		if (!this.#drawSource || !this.#drawLayer) {
			throw new Error('No draw layer or source available.')
		}

		let interactions: Interaction[] = []

		if (tool === 'draw') {
			interactions = createDrawInteraction(
				this.#configuration.layers.find((l) => l.id === this.#drawLayerId) ??
					{},
				entry as DrawMode,
				this.#drawSource,
				this.#map
			)
		} else if (tool === 'edit') {
			interactions = createModifyInteractions(
				this.#configuration.layers.find((l) => l.id === this.#drawLayerId) ??
					{},
				entry as EditMode,
				this.#drawLayer,
				this.#drawSource,
				this.#map
			)
		} else if (tool === 'property') {
			// Not sure if there's anything here yet. Maybe a select or something.
		} else /* tool === 'delete' */ {
			// createDeleteInteractions
		}

		interactions.forEach((interaction) => {
			this.#map.addInteraction(interaction)
			this.#currentInteractions.add(interaction)
		})
	}

	removeAllInteractions() {
		this.#currentInteractions.forEach((interaction) => {
			this.#map.removeInteraction(interaction)
			// @ts-expect-error | "un on removal" riding piggyback as _onRemove
			interaction._onRemove?.()
		})
		this.#currentInteractions.clear()
	}
}
