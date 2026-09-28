import { Feature, Map } from 'ol'
import { isVisible } from '@polar/lib-invisible-style'

export function showTooltip(feature: Feature, map: Map) {
  const visibleFeatures = (feature.get('features') || []).filter(isVisible)
  const isCluster = visibleFeatures.length > 1
  if (isCluster) {
    return [
      ['h2', 'meldemichel.gfi.tooltip.multiHeader'],
      [
        'span',
        `meldemichel.gfi.tooltip.multiBody${
          map.getView().getZoom() === map.getView().getMaxZoom()
            ? 'Unresolvable'
            : ''
        }`,
      ],
    ]
  }
  const tooltipFeature = visibleFeatures[0]
  return [
    ['h2', `${tooltipFeature.get('str')} ${tooltipFeature.get('hsnr')}`],
    ['span', `meldemichel.skat.${tooltipFeature.get('skat')}`],
  ]
}
