export const newCookie = (name, value, days) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  return `${name}=${value};expires=${expires.toUTCString()};path=/;`
}

export const getCookie = (cookies, name) => {
  const value = `; ${cookies}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}
