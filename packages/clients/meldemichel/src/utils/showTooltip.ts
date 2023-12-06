import { Feature } from 'ol'

export const showTooltip = (feature: Feature) => {
  const isCluster = feature.get('features').length > 1
  if (isCluster) {
    return [
      ['h2', 'meldemichel.gfi.tooltip.multiHeader'],
      ['span', 'meldemichel.gfi.tooltip.multiBody'],
    ]
  }
  const tooltipFeature = feature.get('features')[0]
  return [
    ['h2', `${tooltipFeature.get('str')} ${tooltipFeature.get('hsnr')}`],
    ['span', `meldemichel.skat.${tooltipFeature.get('skat')}`],
  ]
}
