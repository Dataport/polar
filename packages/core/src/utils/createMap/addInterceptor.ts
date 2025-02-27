import { AuthenticationConfig } from '@polar/lib-custom-types'
import { getCookie } from '../getCookie'

/**
 * Add an interceptor to fetch to add the token saved in the cookies to the
 * request headers. If interceptors for XMLHttpRequest or axios are needed,
 * add them here.
 * Function is based on functionality from
 * https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/src/modules/login/js/utilsAxios.js
 *
 * @param authConfig - Configuration object of the authentication.
 */
export function addInterceptor({
  interceptorUrlRegex,
  tokenName,
}: AuthenticationConfig) {
  const { fetch: originalFetch } = window

  window.fetch = (resource, originalConfig) => {
    let config = originalConfig

    if (
      interceptorUrlRegex &&
      typeof resource === 'string' &&
      resource.match(interceptorUrlRegex)
    ) {
      config = {
        ...originalConfig,
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${getCookie(tokenName)}` || '',
          ...originalConfig?.headers,
        },
      }
    }

    return originalFetch(resource, config)
  }
}
