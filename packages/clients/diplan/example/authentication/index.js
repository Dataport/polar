const clientId = 'polar'
const scope = 'openid'

let loggedIn = false
let token
let refreshToken

export async function authenticate(username, password, setTokenMethod) {
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
    token = data.access_token
    refreshToken = data.refresh_token
    setTokenMethod(token)
    document.getElementById('login-button').textContent = 'Logout'
    document.getElementById('username').disabled = true
    document.getElementById('password').disabled = true
    loggedIn = true

    setTimeout(
      () => requestNewToken(setTokenMethod),
      (data.expires_in - 15) * 1000
    )
    return
  }
  document.getElementById('error-message').textContent =
    'Die angegebene Kombination aus Nutzername und Passwort ist nicht korrekt.'
  // TODO: Add UI element to a layer if it can only be used via authentication (lock / unlock)
}

async function reset() {
  await revokeToken()
  window.location.reload()
}

async function revokeToken() {
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

async function requestNewToken(setTokenMethod) {
  const url = ''

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(
      refreshToken
    )}&client_id=${encodeURIComponent(clientId)}&scope=${encodeURIComponent(
      scope
    )}`,
  })
  if (response.ok) {
    const data = await response.json()
    token = data.access_token
    refreshToken = data.refresh_token
    setTokenMethod(token)

    setTimeout(
      () => requestNewToken(setTokenMethod),
      (data.expires_in - 15) * 1000
    )
    return
  }
  document.getElementById('error-message').textContent =
    'Die Session ist ausgelaufen und der Token konnte nicht erneuert werden.'
  document.getElementById('login-button').textContent = 'Login'
  document.getElementById('username').disabled = false
  document.getElementById('password').disabled = false
  loggedIn = false
}
