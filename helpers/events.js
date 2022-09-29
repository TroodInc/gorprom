const on = (el, type, callback) => el.addEventListener(type, callback, false)

const off = (el, type, callback) => el.removeEventListener(type, callback, false)

export const bind = (events, callback) => events.forEach(event => on(document, event, callback))

export const unbind = (events, callback) => events.forEach(event => off(document, event, callback))

export const getComposedPath = (event) => {
  if (event.composedPath) return event.composedPath()
  if (event.path) return event.path

  let { target } = event
  const path = []
  while (target.parentNode !== null) {
    path.push(target)
    target = target.parentNode
  }
  return path
}

