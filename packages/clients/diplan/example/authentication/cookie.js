import { parseJWT } from './parseJWT'

/*
 * Functions are based on https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/src/modules/login/js/utilsCookies.js
 * and https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/src/modules/login/js/utilsOIDC.js.
 */

/**
 * Set a cookie value.
 *
 * @param {string} name of cookie to set.
 * @param {string} value to set into a cookie.
 */
export function setCookie(name, value) {
  const date = new Date()
  // Cookie is valid for 15 minutes
  date.setTime(date.getTime() + 15 * 1000)
  document.cookie = `${name}=${
    value || ''
  }; expires=${date.toUTCString()}; secure; path=/`
}

/**
 * Gets value of a cookie.
 *
 * @param {string} name of cookie to retrieve.
 * @returns {string} cookie value.
 */
export function getCookie(name) {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return undefined
}

export function setCookies(token, expiresIn, refreshToken) {
  setCookie('token', token)
  setCookie('expires_in', expiresIn)
  setCookie('refresh_token', refreshToken)

  const account = parseJWT(token)

  setCookie('name', account?.name)
  setCookie('email', account?.email)
  setCookie('username', account?.preferred_username)

  setCookie('expiry', account?.exp)
}

/**
 * Delete all cookies with names given in list
 *
 * @param {String[]} names of cookies to delete
 * @return {void}
 */
export function eraseCookies(names) {
  names.forEach((name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  })
}
