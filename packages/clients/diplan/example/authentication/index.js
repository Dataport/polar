import { eraseCookies, getCookie, setCookies } from './cookie.js'

const clientId = 'polar'
const scope = 'openid'

let loggedIn = false

export async function authenticate(username, password) {
  if (loggedIn) {
    await reset()
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
    setCookies(data.access_token, data.expires_in, data.refresh_token)
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

async function reset() {
  await revokeToken(getCookie('token'))
  await revokeToken(getCookie('refresh_token'))
  eraseCookies([
    'token',
    'expires_in',
    'refresh_token',
    'name',
    'username',
    'email',
    'expiry',
  ])
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
