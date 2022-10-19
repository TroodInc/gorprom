import { useMemo } from 'react'
import { types, applySnapshot, getSnapshot, detach } from 'mobx-state-tree'
import set from 'lodash/set'

import { callApi } from '../helpers/fetch'
import { newCookie } from '../helpers/cookie'


const hasErrors = errors => {
  if (errors === undefined || errors === null) return false
  if (typeof errors === 'object') {
    return Object.keys(errors).reduce((memo, key) => {
      const error = errors[key]
      if (error === undefined || error === null || error === false) return memo || false
      if (typeof error === 'object') return memo || hasErrors(error)
      return true
    }, false)
  }
  return true
}

let store

const simpleTypes = [
  types.string,
  types.number,
  types.boolean,
  types.null,
  types.undefined,
]

const getDeepMap = (deep = 0) => {
  if (deep === 0) return types.union(...simpleTypes)
  return types.union(
    ...simpleTypes,
    types.array(getDeepMap(deep - 1)),
    types.map(getDeepMap(deep - 1)),
  )
}

const Form = types.model('Form', {
  data: types.map(getDeepMap(5)),
  errors: types.map(getDeepMap(5)),
}).views(self => ({
  get(path, toJSON = true) {
    const pathArray = path.split('.')
    const value = pathArray.reduce((memo, key, i) => {
      if (!i) return memo
      if (typeof memo?.get === 'function') return memo.get(key)
      if ((memo || {})[key]) return memo[key]
      return undefined
    }, self[pathArray[0]])
    try {
      if (toJSON) {
        return getSnapshot(value)
      }
      return value
    } catch {
      return value
    }
  },
  get hasErrors() {
    return hasErrors(getSnapshot(self.errors))
  },
})).actions(self => ({
  set(path, value) {
    // if (!isAlive(self)) return
    self.errors.set('globalError', undefined)
    const pathArray = path.split('.')
    const lastKey = pathArray.pop()
    let target = self
    pathArray.forEach((key, i) => {
      if (target) {
        let nextTarget
        if (typeof target.get === 'function') {
          nextTarget = target.get(key, false)
        } else {
          nextTarget = target[key]
        }
        if (!nextTarget) {
          const newPath = [...pathArray.slice(i + 1), lastKey].join('.')
          if (typeof target.set === 'function') {
            target.set(key, set({}, newPath, value))
          } else {
            target[key] = set({}, newPath, value)
          }
        }
        target = nextTarget
      }
    })
    if (target) {
      if (typeof target.set === 'function') {
        target.set(lastKey, value)
      } else {
        target[lastKey] = value
      }
    }
  },
  submit(url, method = 'POST', options = {}) {
    const data = getSnapshot(self.data)
    const { token } = store
    const { headers = {} } = options
    if (token) {
      headers.Authorization = `Token ${token}`
    }
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
    return callApi(url, {
      ...options,
      method,
      body: JSON.stringify(data),
      headers,
    })
      .catch(error => {
        const errorData = error?.error?.data
        if (errorData) {
          if (errorData?.error) {
            self.set('errors.globalError', errorData.error)
          }
          //TODO set other errors
        }
        return Promise.reject(error)
      })
  },
}))

const FormStore = types.model('FormStore', {
  modalComponent: types.maybe(types.string),
  props: types.maybe(types.frozen()),
  form: Form,
})

const Store = types.model('store', {
  formStore: types.map(FormStore),
  authData: types.frozen({}),
}).views(self => ({
  get token() {
    return self.authData?.token
  },
})).actions(self => ({
  createFormStore(name, { modalComponent, form = {}, props } = {}) {
    if (!self.formStore.has(name)) {
      self.formStore.set(name, { modalComponent, form, props })
    }
    return self.formStore.get(name)
  },
  deleteFormStore(name) {
    detach(self.formStore.get(name))
  },
  setAuthData(data) {
    self.authData = data
    if (window !== undefined && data.token) {
      window.document.cookie = newCookie('token', data.token, 365)
    }
  },
  clearAuthData() {
    self.authData = {}
    if (window !== undefined) {
      window.document.cookie = newCookie('token', '', 0)
    }
  },
}))

export const initializeStore = (snapshot = null) => {
  const _store = store ?? Store.create()

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot)
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return store
}

export const useStore = (initialState) => {
  return useMemo(() => initializeStore(initialState), [initialState])
}
