const fetcher = async(url, options) => {
  try {
    const resp = await fetch(url, options)
    const contentType = resp.headers.get('content-type') || ''
    const mainType = contentType.split(';')[0]
    let data
    switch (mainType) {
      case 'application/json':
        data = await resp.json()
        break
      case 'text/html':
        data = await resp.text()
        break
      case 'application/octet-stream':
        data = await resp.blob()
        break
      default:
        data = await resp.text()
    }

    const error = resp.status >= 400
    if (error) {
      return Promise.reject({ status: resp.status, error: data })
    }
    return { status: resp.status, data }
  } catch {
    return Promise.reject({
      status: 0,
      error: {
        data: {
          error: 'Connection error',
        },
      },
    })
  }
}

export const callGetApi = async(url, options = {}) => {
  return await fetcher(url, { ...options, method: 'GET' })
}

export const callPostApi = async(url, options = {}) => {
  return await fetcher(url, { ...options, method: 'POST' })
}

export const callPutApi = async(url, options = {}) => {
  return await fetcher(url, { ...options, method: 'PUT' })
}

export const callDeleteApi = async(url, options = {}) => {
  return await fetcher(url, { ...options, method: 'DELETE' })
}

export const callPatchApi = async(url, options = {}) => {
  return await fetcher(url, { ...options, method: 'PATCH' })
}

export const callApi = async(url, options = {}) => {
  return await fetcher(url, options)
}

export const getApiPath = (path = '/', host) => {
  try {
    const url = new URL(path)
    return url.toString()
  } catch {}
  try {
    const url = new URL(path, host)
    return url.toString()
  } catch {}
  return path
}

export const getFullUrl = (url, params = {}) => {
  const urlObj = new URL(url)
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, item))
    } else {
      searchParams.append(key, value)
    }
  })
  urlObj.search = searchParams.toString()

  return urlObj.toString()
}
