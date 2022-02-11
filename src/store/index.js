import Vue from 'vue'
import Vuex from 'vuex'
import { post } from '../common/js/http'
import { getItem } from '../common/js/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defaultAvatar: require('./moren@2x.png'),
    appConfig: {},
    categories: [],
    userInfo: {
      profile: {}
    },
    tim: null,
    currentVideo: '',
    routerLoading: false
  },
  mutations: {
    changeHistory(state, list) {
      state.routeHistory = list
    },
    changeConfig(state, data) {
      state.appConfig = data
    },
    changeCate(state, data) {
      state.categories = data
    },
    changeUserInfo(state, info) {
      state.userInfo = info
    },
    changeIm(state, im) {
      state.tim = im
    },
    changeVideo(state, video) {
      state.currentVideo = video
    },
    changeRouterLoading(state, loading) {
      state.routerLoading = loading
    }
  },
  actions: {
    initConfig({ commit }) {
      post('/webapi/config/getCommonConfig')
        .then(({ data: { data } }) => {
          commit('changeConfig', data.config)
        })
      post('/webapi/live/getCategory')
        .then(({ data: { data } }) => {
          commit('changeCate', data)
        })
    },
    getUserInfo({ commit }) {
      const token = getItem('token')
      if (!token) return
      return post('/webapi/User/getUserInfo', { notRedirect: true, hideLoading: true })
        .then(({ data: { data } }) => {
          commit('changeUserInfo', data)
        })
    }
  },
  modules: {
  }
})
