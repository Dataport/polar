import { authenticate } from './index.js'

export function validateForm() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const errorMessage = document.getElementById('error-message')

  if (!username || !password) {
    errorMessage.textContent =
      'Bitte geben Sie sowohl einen Nutzernamen als auch ein Passwort ein.'
  } else {
    errorMessage.textContent = ''
    authenticate(username, password)
  }
}
