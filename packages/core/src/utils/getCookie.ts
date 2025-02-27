/**
 * @param name - Name of the cookie.
 * @returns Returns the value of a cookie with the given name or undefined.
 */
export function getCookie(name: string) {
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(name))
  return cookie ? cookie.substring(name.length + 1) : undefined
}
