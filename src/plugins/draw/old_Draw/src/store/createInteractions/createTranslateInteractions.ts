import { Translate, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Collection, Feature, Map } from 'ol'
import { CreateInteractionsPayload, DrawGetters, DrawState } from '../../types'
import { makeLocalSelector } from './localSelector'
import { getSnaps } from './getSnaps'

const createTranslate = (
  map: Map,
  drawLayer: CreateInteractionsPayload['drawLayer']
) => {
  const activeContainer = { active: false }
  const features: Collection<Feature> = new Collection()
  const translate = new Translate({ features })
  translate.set('_isPolarDragLikeInteraction', true, true)
  translate.on('translatestart', () => {
    activeContainer.active = true
  })
  translate.on('translateend', () => {
    activeContainer.active = false
  })

  const localSelector = makeLocalSelector(
    map,
    activeContainer,
    features,
    drawLayer
  )
  map.on('pointermove', localSelector)
  // @ts-expect-error | "un on removal" riding piggyback as _onRemove
  translate._onRemove = () => map.un('pointermove', localSelector)

  return translate
}

export default function (
  { rootGetters }: PolarActionContext<DrawState, DrawGetters>,
  { drawSource, drawLayer }: CreateInteractionsPayload
): Interaction[] {
  return [
    createTranslate(rootGetters.map, drawLayer),
    ...getSnaps(rootGetters.map, rootGetters.configuration?.draw?.snapTo || []),
    new Snap({ source: drawSource }),
  ]
}
