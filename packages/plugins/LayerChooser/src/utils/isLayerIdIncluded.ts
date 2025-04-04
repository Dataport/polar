import { LayerConfiguration } from '@polar/lib-custom-types'

export const isLayerIdIncluded = (layers: LayerConfiguration[], id: string) =>
  layers.findIndex((available) => available.id === id) === -1
