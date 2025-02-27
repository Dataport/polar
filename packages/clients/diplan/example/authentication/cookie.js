/*
 * Functions are based on https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/src/modules/login/js/utilsCookies.js
 * and https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/src/modules/login/js/utilsOIDC.js.
 */

/**
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

/**
 * @param {string} name of the cookie to delete.
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}
