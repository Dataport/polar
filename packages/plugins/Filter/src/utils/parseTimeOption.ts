import { FilterConfigurationTimeOption } from '@polar/lib-custom-types'
import { TimeOption } from '../types'

export const parseTimeOption =
  (timeDirection: 'last' | 'next') =>
  (config: FilterConfigurationTimeOption): TimeOption[] =>
    config.amounts.map((amount) => ({
      label: `common:plugins.filter.time.${timeDirection}.${
        config.unit || 'days'
      }`,
      component: null,
      amount,
      unit: config.unit || 'days',
      now: null,
      type: timeDirection,
    }))
