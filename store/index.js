import { useMemo } from 'react'
import { types, applySnapshot, getSnapshot, detach, getParent, isAlive, isArrayType, getType } from 'mobx-state-tree'
import set from 'lodash/set'

import { callApi, getFullUrl } from '../helpers/fetch'
import { newCookie } from '../helpers/cookie'


const normalize = obj => {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      const array = []
      for (let i = 0; i < obj.length; i += 1) {
        array.push(normalize(obj[i]))
      }
      return array
    } else {
      return Object.entries(obj).reduce((memo, [key, value]) => {
        return {
          ...memo,
          [key]: normalize(value),
        }
      }, {})
    }
  }
  return obj
}

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

const HttpQuery = types.model('GetQuery', {
  callTime: types.number,
  response: getDeepMap(10),
  loaded: types.boolean,
}).views(self => ({
  get(path = '') {
    const pathArray = path.split('.')
    const value = path ? pathArray.reduce((memo, key, i) => {
      if (typeof memo?.get === 'function') return memo.get(key)
      if ((memo || {})[key]) return memo[key]
      return undefined
    }, self.response) : self.response
    try {
      return getSnapshot(value)
    } catch {
      return value || undefined
    }
  },
})).actions(self => ({
  setLoaded(loaded) {
    self.loaded = loaded
  },
  setCallTime(callTime) {
    self.callTime = callTime
  },
  setResponse(response) {
    self.response = response
  },
}))

const Form = types.model('Form', {
  data: types.map(getDeepMap(5)),
  errors: types.map(getDeepMap(5)),
}).views(self => ({
  get(path, toJSON = true) {
    if (getParent(self).detached) return undefined
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
      return value || undefined
    } catch {
      return value || undefined
    }
  },
  get hasErrors() {
    return hasErrors(getSnapshot(self.errors))
  },
})).actions(self => ({
  set(path, value) {
    if (!isAlive(self)) return
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
            target.set(key, normalize(set({}, newPath, value)))
          } else if (isArrayType(getType(target))) {
            const index = +key
            if (Number.isNaN(index)) {
              throw new Error('Wrong path name')
            }
            if (index > target.length) {
              for (let i = 0; i < index; i += 1) {
                target[i] = target[i] || undefined
              }
            }
            target[key] = normalize(set({}, newPath, value))
          } else {
            target[key] = normalize(set({}, newPath, value))
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
        let globalError = error
        while (globalError && typeof globalError === 'object') {
          globalError = globalError.error || globalError.data
        }
        if (globalError) {
          self.set('errors.globalError', globalError)
        }
        /*
        const errorData = error?.error?.data
        if (errorData) {
          //TODO set other errors
        }
        */
        return Promise.reject(error)
      })
  },
}))

const FormStore = types.model('FormStore', {
  modalComponent: types.maybe(types.string),
  props: types.maybe(types.frozen()),
  form: Form,
  detached: types.optional(types.boolean, false),
})
  .actions(self => ({
    setDetached(detached = true) {
      self.detached = detached
    },
  }))

const Store = types.model('store', {
  httpQuery: types.map(HttpQuery),
  formStore: types.map(FormStore),
  authData: types.frozen({}),
}).views(self => ({
  get token() {
    return self.authData?.token
  },
})).actions(self => ({
  createFormStore(name, { modalComponent, form = {}, props } = {}) {
    if (!self.formStore.has(name) || self.formStore.get(name).detached) {
      self.formStore.set(name, { modalComponent, form, props })
    }
    return self.formStore.get(name)
  },
  deleteFormStore(name) {
    if (self.formStore.has(name)) {
      const fs = self.formStore.get(name)
      fs.setDetached()
      detach(fs)
    }
  },
  setAuthData(data) {
    const { token } = store
    self.authData = {
      ...data,
      token: data.token || token,
    }
    if (window !== undefined && self.authData.token) {
      window.document.cookie = newCookie('token', self.authData.token, 365)
    }
  },
  clearAuthData() {
    self.authData = {}
    if (window !== undefined) {
      window.document.cookie = newCookie('token', '', 0)
    }
  },
  callHttpQuery(tmpURL, { params, headers, cacheTime = 2000, method = 'GET', ...options } = {}) {
    const url = getFullUrl(tmpURL, params)

    if (self.httpQuery.has(url)) {
      const prev = self.httpQuery.get(url)
      if (Date.now() - prev.callTime <= cacheTime) {
        return prev
      }
    } else {
      self.httpQuery.set(url, {
        callTime: Date.now(),
        response: {},
        loaded: false,
      })
    }

    const httpQuery = self.httpQuery.get(url)

    httpQuery.setCallTime(Date.now())
    httpQuery.setLoaded(false)

    const { token } = self
    const myHeaders = {
      ...headers,
    }
    if (token) {
      myHeaders.Authorization = `Token ${token}`
    }

    callApi(url, {
      ...options,
      method,
      headers: myHeaders,
    })
      .then(response => {
        httpQuery.setLoaded(true)
        httpQuery.setResponse(response)
      })

    return httpQuery
  },
}))

export const initializeStore = (snapshot = null) => {
  if (store) return store

  const _store = Store.create()

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
