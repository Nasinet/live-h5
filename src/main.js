import 'lib-flexible'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Loading, Tab, Tabs, Icon, Toast, Dialog, Swipe, SwipeItem, Popup, Divider, Picker, List } from 'vant'
import BuyConfirm from './components/buy-dynamic-alert'
import PreviewImg from './components/preview-img'
import './assets/reset.css'
import './common/style/base.styl'
// import VConsole from 'vconsole'

Vue.use(Loading)
Vue.use(Tabs)
Vue.use(Tab)
Vue.use(Icon)
Vue.use(BuyConfirm)
Vue.use(PreviewImg)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(List)
Vue.use(Popup)
Vue.use(Divider)
Vue.use(Picker)

// eslint-disable-next-line no-new
// new VConsole()

Vue.prototype.$confirm = Dialog.confirm
Vue.prototype.$toast = Toast
Vue.prototype.$DPlayer = window.DPlayer

Vue.config.productionTip = false

Vue.prototype.$download = () => {
  const u = navigator.userAgent
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
  if (isiOS) {
    window.location.href = store.state.appConfig.dl_web_url
  } else if (isAndroid) {
    window.location.href = store.state.appConfig.dl_web_url
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
