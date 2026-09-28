const clientId = 'polar'
const scope = 'openid'

// These values are based on the respective KeyCloak configuration
const authenticationUrl = ''
const revokeTokenUrl = ''
const refreshTokenUrl = ''

const loginButton = document.getElementById('login-button') as HTMLButtonElement
const usernameInput = document.getElementById('username') as HTMLInputElement
const passwordInput = document.getElementById('password') as HTMLInputElement
const errorMessage = document.getElementById(
  'error-message'
) as HTMLParagraphElement

let loggedIn = false
let token: string
let refreshToken: string

export async function authenticate(
  username: string,
  password: string,
  setTokenMethod: (token: string) => void
) {
  if (loggedIn) {
    await reset()
    return
  }

  const response = await fetch(authenticationUrl, {
    method: 'POST',
    headers: {
      // The header is defined like that
      // eslint-disable-next-line @typescript-eslint/naming-convention
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

    loginButton.textContent = 'Logout'
    usernameInput.disabled = true
    passwordInput.disabled = true

    loggedIn = true

    setTimeout(
      () => requestNewToken(setTokenMethod),
      (data.expires_in - 15) * 1000
    )
    return
  }
  errorMessage.textContent =
    'Die angegebene Kombination aus Nutzername und Passwort ist nicht korrekt.'
}

async function reset() {
  await revokeToken()
  window.location.reload()
}

async function revokeToken() {
  const response = await fetch(revokeTokenUrl, {
    method: 'POST',
    headers: {
      // The header is defined like that
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: `grant_type=refresh_token&token=${encodeURIComponent(
      token
    )}&client_id=${encodeURIComponent(clientId)}`,
  })
  if (response.ok) {
    return
  }
  errorMessage.textContent = 'Der Nutzer konnte nicht abgemeldet werden.'
}

async function requestNewToken(setTokenMethod) {
  const response = await fetch(refreshTokenUrl, {
    method: 'POST',
    headers: {
      // The header is defined like that
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
  errorMessage.textContent =
    'Die Session ist ausgelaufen und der Token konnte nicht erneuert werden.'
  loginButton.textContent = 'Login'
  usernameInput.disabled = false
  passwordInput.disabled = false
  loggedIn = false
}
