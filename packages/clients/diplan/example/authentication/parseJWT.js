/**
 * Parses jwt token. This function does *not* validate the token.
 * Function is based on https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/src/modules/login/js/utilsOIDC.js.
 *
 * @param {string} token jwt token to be parsed.
 * @returns {object} parsed jwt token as object
 */
export function parseJWT(token) {
  try {
    if (!token) {
      return {}
    }

    const base64Url = token.split('.')[1]
    if (!base64Url) {
      return {}
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(
      decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
    )
  } catch (e) {
    // If token is not valid or another error occurs, return an empty object
    return {}
  }
}
