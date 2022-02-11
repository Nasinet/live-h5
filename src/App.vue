<template>
  <div id="app">
    <div @touchmove.prevent v-if="routerLoading" class="router-loading">
      <van-loading size="50px" type="circular" color="#18D5D9" />
    </div>
    <keep-alive include="home,live,group">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getItem, setItem } from './common/js/storage'
import { post } from './common/js/http'
import moment from 'moment'

export default {
  created() {
    this.initConfig()
    this.getUserInfo()
    this.createTourist()
  },
  computed: {
    ...mapState(['routerLoading'])
  },
  methods: {
    ...mapActions(['initConfig', 'getUserInfo']),
    createTourist() {
      const local = getItem('tourist')
      if (local && Date.now() < 170 * 24 * 60 * 60 * 1000 + local.createTime) {
        return
      }
      const userName = `游客P${moment().format('YYYYMMDDHHmmss')}${parseInt(Math.random() * 100)}`
      post('/api/user/getTempUserKey', {
        temp_uid: userName
      })
        .then(({ data: { data } }) => {
          setItem('tourist', {
            userName,
            sign: data.txim_sign,
            createTime: Date.now()
          })
        })
    }
  }
}
</script>

<style lang="stylus">
  html
    height 100%
    min-height 100%
  body
    height 100%
  #app
    height 100%
  .router-loading
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    background #fff
    z-index 99999
    display flex
    justify-content center
    align-items center
</style>
