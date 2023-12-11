import Style from 'ol/style/Style'
import { Feature } from 'ol'

export const InvisibleStyle = new Style()
export const isInvisible = (feature: Feature): boolean =>
  feature.getStyle() === InvisibleStyle
export const isVisible = (feature: Feature): boolean =>
  feature.getStyle() !== InvisibleStyle
