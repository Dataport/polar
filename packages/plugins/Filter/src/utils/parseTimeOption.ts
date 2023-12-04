import { FilterConfigurationTimeOption } from '@polar/lib-custom-types'

export const parseTimeOption =
  (timeDirection: 'last' | 'next') => (config: FilterConfigurationTimeOption) =>
    config.amounts.map((amount) => ({
      label: `common:plugins.filter.time.${timeDirection}.${config.unit}`,
      component: null,
      amount,
      unit: config.unit,
      now: null,
      type: timeDirection,
    }))
