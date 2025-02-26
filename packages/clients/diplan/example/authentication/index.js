import { deleteCookie, getCookie, setCookie } from './cookie.js'

const clientId = 'polar'
const scope = 'openid'

let loggedIn = false

export async function authenticate(username, password, { tokenName }) {
  if (loggedIn) {
    await reset(tokenName)
    return
  }

  const url = ''

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `grant_type=password&client_id=${encodeURIComponent(
      clientId
    )}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(
      password
    )}&scope=${encodeURIComponent(scope)}`,
  })
  if (response.ok) {
    const data = await response.json()
    setCookie(tokenName, data.access_token)
    document.getElementById('login-button').textContent = 'Logout'
    document.getElementById('username').disabled = true
    document.getElementById('password').disabled = true
    loggedIn = true
    return
  }
  document.getElementById('error-message').textContent =
    'Die angegebene Kombination aus Nutzername und Passwort ist nicht korrekt.'
  // TODO: Add UI element to a layer if it can only be used via authentication (lock / unlock)
}

async function reset(tokenName) {
  await revokeToken(getCookie('token'))
  deleteCookie(tokenName)
  window.location.reload()
}

async function revokeToken(token) {
  const url = ''

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `grant_type=refresh_token&token=${encodeURIComponent(
      token
    )}&client_id=${encodeURIComponent(clientId)}`,
  })
  if (response.ok) {
    return
  }
  document.getElementById('error-message').textContent =
    'Der Nutzer konnte nicht abgemeldet werden.'
}
