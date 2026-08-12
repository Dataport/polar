import type { EventsKey } from 'ol/events'
import type Interaction from 'ol/interaction/Interaction'
import type VectorLayer from 'ol/layer/Vector'
import type Map from 'ol/Map'
import type VectorSource from 'ol/source/Vector'
import type {
	DrawMode,
	DrawPluginOptions,
	EditMode,
	InteractionOptions,
	ToolMode,
} from '../../types'

import { unByKey } from 'ol/Observable'

import createDeleteInteractions from './createDeleteInteractions'
import { createDrawInteraction } from './createDrawInteractions'
import { createEditInteractions } from './createEditInteractions'

// This is a class since it works independently of vue and its framework
// Don't make the next migration harder than it has to be
export class InteractionManager {
	#map: Map
	#drawLayerId = ''
	#drawLayer: VectorLayer | null = null
	#drawSource: VectorSource | null = null
	#currentInteractions = new Set<Interaction>()
	#configuration: DrawPluginOptions
	#sourceChangeCallback: ((drawSource: VectorSource) => void) | undefined
	#uns: EventsKey[] = []

	constructor(
		map: Map,
		configuration: DrawPluginOptions,
		drawLayer: VectorLayer,
		sourceChangeCallback?: (drawSource: VectorSource) => void
	) {
		this.#map = map
		this.#configuration = configuration
		if (sourceChangeCallback) {
			this.#sourceChangeCallback = sourceChangeCallback
		}
		this.determineDrawSource(drawLayer)
	}

	destructor() {
		this.removeAllInteractions()
		if (this.#uns.length > 0) {
			this.#uns.forEach((key) => {
				unByKey(key)
			})
			this.#uns = []
		}
	}

	updateDrawLayer(drawLayer: VectorLayer) {
		this.removeAllInteractions()
		this.determineDrawSource(drawLayer)
	}

	determineDrawSource(drawLayer: VectorLayer) {
		if (this.#uns.length > 0) {
			this.#uns.forEach((key) => {
				unByKey(key)
			})
			this.#uns = []
		}

		this.#drawLayer = drawLayer
		this.#drawSource = drawLayer.getSource()
		this.#drawLayerId = drawLayer.get('id')

		if (this.#drawSource) {
			this.#uns = this.#drawSource.on(
				['addfeature', 'changefeature', 'removefeature'],
				() => {
					this.#sourceChangeCallback?.(this.#drawSource as VectorSource)
				}
			)
		}
	}

	getDrawSource() {
		return this.#drawSource
	}

	initializeInteractions(
		tool: ToolMode,
		entry: string | undefined,
		{
			selectedFeature,
			measureMode,
			text,
			activeLassoIds,
			drawing,
		}: InteractionOptions
	) {
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
				measureMode ?? 'none',
				this.#drawSource,
				this.#map,
				text,
				drawing
			)
		} else if (tool === 'edit') {
			interactions = createEditInteractions(
				this.#configuration.layers.find((l) => l.id === this.#drawLayerId) ??
					{},
				entry as EditMode,
				this.#drawLayer,
				this.#drawSource,
				this.#map,
				activeLassoIds,
				selectedFeature
			)
		} else /* assume (tool === 'delete') */ {
			interactions = createDeleteInteractions(
				this.#map,
				this.#drawLayer,
				this.#drawSource
			)
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
