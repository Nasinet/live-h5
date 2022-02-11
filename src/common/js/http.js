import axios from 'axios'
import { Toast } from 'vant'
import { getItem, removeItem } from './storage'
import router from '../../router'
import store from '../../store'

let loading = null

export function getSearch() {
  const query = window.location.search.substring(1)
  var vars = query.split('&')
  const res = {}
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    res[pair[0]] = pair[1]
  }
  return res
}

const instance = axios.create({
  baseURL: 'https://live.nasinet.com',
  timeout: 5000
})

instance.interceptors.response.use((res) => {
  loading && loading.close()
  if (res.data.msg === '登录超时，请重新登录') {
    store.commit('changeUserInfo', {})
    removeItem('token')
    removeItem('uid')
    if (router.currentRoute.name !== 'login' && res.config.url !== '/webapi/User/getUserInfo') {
      router.push('/login')
    }
    return Promise.reject(new Error(res.data.msg))
  }
  if (res.data.msg) {
    Toast.fail(res.data.msg)
    return Promise.reject(new Error(res.data.msg))
  }
  return res
}, (err) => {
  loading && loading.close()
  Toast.fail('请求超时，请稍后再试')
  return Promise.reject(err)
})

export const post = (url, data = {}) => {
  if (!data.hideLoading) {
    loading = Toast.loading()
  } else {
    delete data.hideLoading
  }
  url = url.indexOf('api') >= 0 ? url : '/api' + url
  const uid = getItem('uid')
  const token = getItem('token')
  if (!data) data = {}
  if (token && uid) {
    data.token = decodeURIComponent(token)
    data.uid = uid
  }
  return instance.post(url, data)
}
