import {
  CoreGetters,
  CoreState,
  PolarActionContext,
} from '@polar/lib-custom-types'

export function addInterceptor({
  getters,
}: PolarActionContext<CoreState, CoreGetters>) {
  const { secureServiceUrlRegex } = getters.configuration
  const { fetch: originalFetch } = window

  // If interceptors for XMLHttpRequest or axios are needed, add them here
  window.fetch = (resource, originalConfig) => {
    let config = originalConfig

    if (
      secureServiceUrlRegex &&
      typeof resource === 'string' &&
      resource.match(secureServiceUrlRegex)
    ) {
      config = {
        ...originalConfig,
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${getters.oidcToken}` || '',
          ...originalConfig?.headers,
        },
      }
    }

    return originalFetch(resource, config)
  }
}
