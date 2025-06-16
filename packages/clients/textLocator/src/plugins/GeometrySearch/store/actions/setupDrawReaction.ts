import { PolarActionContext, PolarStore } from '@polar/lib-custom-types'
import debounce from 'lodash.debounce'
import { Feature } from 'ol'
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector'
import { GeometrySearchGetters, GeometrySearchState } from '../../types'

let debouncedSearchGeometry

export function setupDrawReaction(
  this: PolarStore<GeometrySearchState, GeometrySearchGetters>,
  {
    rootGetters,
    dispatch,
  }: PolarActionContext<GeometrySearchState, GeometrySearchGetters>
) {
  // features added multiple times; avoid overly requesting
  debouncedSearchGeometry = debounce(
    (feature: Feature) => dispatch('searchGeometry', feature),
    20
  ).bind(this)

  // only keep a single feature in the draw tool
  const drawSource = rootGetters['plugin/draw/drawSource'] as VectorSource
  let lastFeature: Feature | undefined
  drawSource.on(['addfeature'], function (event) {
    const nextFeature = (event as VectorSourceEvent).feature
    if (nextFeature && lastFeature !== nextFeature) {
      lastFeature = nextFeature
      drawSource.clear()
      drawSource.addFeature(nextFeature)
      debouncedSearchGeometry(nextFeature)
    }
  })
}
