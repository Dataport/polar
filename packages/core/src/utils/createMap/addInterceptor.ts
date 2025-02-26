import { getCookie } from '../getCookie'

/**
 * Add an interceptor to fetch to add the token saved in the cookies to the
 * request headers. If interceptors for XMLHttpRequest or axios are needed,
 * add them here.
 * Function is based on functionality from
 * https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/src/modules/login/js/utilsAxios.js
 *
 * @param interceptorUrlRegex - URLs fitting this regular expression have the token added.
 */
export function addInterceptor(interceptorUrlRegex: string) {
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { Authorization: `Bearer ${getCookie('token')}` },
      }
    }

    return originalFetch(resource, config)
  }
}
