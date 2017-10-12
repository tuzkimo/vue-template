import axios from 'axios'

const root = 'http://localhost/api/'

const toType = obj => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

const filterNull = obj => {
  for (var key in obj) {
    if (obj[key] === null) {
      delete obj[key]
    }
  }
  if (toType(obj[key]) === 'string') {
    obj[key] = obj[key].trim()
  } else if (toType(obj[key]) === 'object') {
    obj[key] = filterNull(obj[key])
  } else if (toType(obj[key]) === 'array') {
    obj[key] = filterNull(obj[key])
  }
  return obj
}

const apiAxios = (method, url, params, success, failure) => {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false
  })
  .then(res => {
    if (res.data.success === true) {
      if (success) {
        success(res.data)
      }
    } else {
      if (failure) {
        failure(res.data)
      } else {
        window.alert('error' + JSON.stringify(res.data))
      }
    }
  })
  .catch(err => {
    if (err) {
      window.alert('api error, HTTP CODE: ' + err.response.status)
      return
    }
  })
}

export default {
  get: (url, params, success, failure) => apiAxios('GET', url, params, success, failure),
  post: (url, params, success, failure) => apiAxios('POST', url, params, success, failure),
  put: (url, params, success, failure) => apiAxios('PUT', url, params, success, failure),
  delete: (url, params, success, failure) => apiAxios('DELETE', url, params, success, failure)
}
