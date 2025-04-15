import { authenticate } from './authentication'

export function validateForm(setTokenMethod: (token: string) => void) {
  const username = (document.getElementById('username') as HTMLInputElement)
    .value
  const password = (document.getElementById('password') as HTMLInputElement)
    .value
  const errorMessage = document.getElementById(
    'error-message'
  ) as HTMLParagraphElement

  if (!username || !password) {
    errorMessage.textContent =
      'Bitte geben Sie sowohl einen Nutzernamen als auch ein Passwort ein.'
  } else {
    errorMessage.textContent = ''
    authenticate(username, password, setTokenMethod)
  }
}
