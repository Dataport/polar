import { Feature } from 'ol'
import { isVisible } from '@polar/lib-invisible-style'

export const showTooltip = (feature: Feature) => {
  const visibleFeatures = (feature.get('features') || []).filter(isVisible)
  const isCluster = visibleFeatures.length > 1
  if (isCluster) {
    return [
      ['h2', 'meldemichel.gfi.tooltip.multiHeader'],
      ['span', 'meldemichel.gfi.tooltip.multiBody'],
    ]
  }
  const tooltipFeature = visibleFeatures[0]
  return [
    ['h2', `${tooltipFeature.get('str')} ${tooltipFeature.get('hsnr')}`],
    ['span', `meldemichel.skat.${tooltipFeature.get('skat')}`],
  ]
}
