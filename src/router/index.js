import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/live/live'
import LiveDetail from '../views/live-detail/live-detail'
import Dynamic from '../views/home/Home'
import PostDetail from '../views/post/post'
import My from '../views/my/my'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/rank/:type',
    name: 'rank',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rank" */ '../views/rank/rank')
  },
  {
    path: '/user-rank',
    name: 'userRank',
    component: () => import(/* webpackChunkName: "userRank" */ '../views/user-rank/user-rank')
  },
  {
    path: '/task',
    name: 'task',
    component: () => import(/* webpackChunkName: "task" */ '../views/task/task')
  },
  {
    path: '/post/:id',
    name: 'post',
    component: PostDetail
  },
  {
    path: '/send/:type',
    name: 'send',
    component: () => import(/* webpackChunkName: "send" */ '../views/post-send/post-send')
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: Dynamic
  },
  {
    path: '/live/:id',
    name: 'liveDetail',
    component: LiveDetail
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/login')
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import(/* webpackChunkName: "register" */ '../views/forget/forget')
  },
  {
    path: '/circle',
    name: 'circle',
    component: () => import(/* webpackChunkName: "circle" */ '../views/circle/circle')
  },
  {
    path: '/circle/:id',
    name: 'square',
    component: () => import(/* webpackChunkName: "square" */ '../views/circle-square/circle-square')
  },
  {
    path: '/my',
    name: 'my',
    component: My
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import(/* webpackChunkName: "setup" */ '../views/setup/setup')
  },
  {
    path: '/cooperation',
    name: 'cooperation',
    component: () => import(/* webpackChunkName: "cooperation" */ '../views/cooperation/cooperation')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ '../views/search/search')
  },
  {
    path: '/watch/history',
    name: 'watchHistory',
    component: () => import(/* webpackChunkName: "watchHistory" */ '../views/watch-history/watch-history')
  },
  {
    path: '/my/msg',
    name: 'sysMsg',
    component: () => import(/* webpackChunkName: "sysMsg" */ '../views/msg/msg')
  },
  {
    path: '/my/recharge',
    name: 'recharge',
    component: () => import(/* webpackChunkName: "recharge" */ '../views/recharge/recharge')
  },
  {
    path: '/my/wallet',
    name: 'wallet',
    component: () => import(/* webpackChunkName: "wallet" */ '../views/wallet/wallet')
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import(/* webpackChunkName: "withdraw" */ '../views/withdraw-record/withdraw-record')
  },
  {
    path: '/my/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '../views/account/account')
  },
  {
    path: '/my/income',
    name: 'income',
    component: () => import(/* webpackChunkName: "income" */ '../views/income/income')
  },
  {
    path: '/my/info',
    name: 'userInfo',
    component: () => import(/* webpackChunkName: "userInfo" */ '../views/user-info/user-info')
  },
  {
    path: '/my/rank',
    name: 'honeyRank',
    component: () => import(/* webpackChunkName: "honeyRank" */ '../views/honey-rank/honey-rank')
  },
  {
    path: '/my/verify',
    name: 'verify',
    component: () => import(/* webpackChunkName: "verify" */ '../views/verify/verify')
  },
  {
    path: '/my/collection',
    name: 'collection',
    component: () => import(/* webpackChunkName: "collection" */ '../views/collection/collection')
  },
  {
    path: '/vip',
    name: 'vip',
    component: () => import(/* webpackChunkName: "vip" */ '../views/vip/vip')
  },
  {
    path: '/my/dynamic',
    name: 'userDynamic',
    component: () => import(/* webpackChunkName: "userDynamic" */ '../views/user-dynamic/user-dynamic')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'login' && to.name !== 'forget' && !getItem('uid')) {
//     next('/login')
//   } else {
//     next()
//   }
// })

router.beforeEach((to, form, next) => {
  store.commit('changeRouterLoading', true)
  next()
})

router.afterEach(() => {
  store.commit('changeRouterLoading', false)
})

export default router
